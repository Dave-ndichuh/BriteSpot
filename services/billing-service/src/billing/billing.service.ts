import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaClient } from '@britespot/database';

const prisma = new PrismaClient();

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  // Assuming router-service is available at this local URL in docker
  private readonly routerServiceUrl = process.env.ROUTER_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Core Workflow: Payment Success -> Create Router User -> Assign Speed Profile -> Set Expiry Time -> Enable Internet Access
   */
  async activateSession(paymentId: string) {
    this.logger.log(`Activating session for Payment ID: ${paymentId}`);

    // 1. Fetch Payment and related Package details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { customer: true, vendor: { include: { routers: true } } },
    });

    if (!payment || payment.status !== 'SUCCESS') {
      throw new HttpException('Invalid or unpaid payment record', HttpStatus.BAD_REQUEST);
    }

    // In a real scenario, we'd have the specific package purchased linked to the payment.
    // Assuming the customer bought a package, let's fetch their latest voucher or intended package.
    // For this MVP step, we will assign a default package if not explicitly linked.
    const pkg = await prisma.package.findFirst({
      where: { vendorId: payment.vendorId },
    });

    if (!pkg) {
      throw new HttpException('No packages found for vendor', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const router = payment.vendor.routers[0]; // Assuming 1 router per vendor for MVP
    if (!router) {
      throw new HttpException('Vendor has no routers configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. Calculate Expiry
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + pkg.durationMinutes * 60000);

    // 3. Create Router User (via HTTP call to router-service)
    const username = `bs_${payment.customer.phone}`;
    const password = Math.random().toString(36).slice(-6); // Random password for Hotspot

    try {
      this.logger.log(`Calling router-service to provision user ${username}`);
      await firstValueFrom(
        this.httpService.post(`${this.routerServiceUrl}/routeros/add-user`, {
          routerParams: {
            host: router.ipAddress,
            user: router.apiUsername,
            password: router.apiPassword,
          },
          userParams: {
            name: username,
            password: password,
            profile: pkg.speedLimit, // Use speed limit as profile name in RouterOS
            limitUptime: `${pkg.durationMinutes}m`,
          }
        })
      );
    } catch (err) {
      this.logger.error(`Router provisioning failed: ${err.message}`);
      throw new HttpException('Failed to provision router access', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 4. Record Session in Database
    const session = await prisma.session.create({
      data: {
        vendorId: payment.vendorId,
        customerId: payment.customerId,
        routerMac: router.macAddress || 'UNKNOWN',
        deviceMac: payment.customer.macAddress || 'UNKNOWN', // Ideally captured during portal login
        ipAddress: 'PENDING', // Will be updated by Radius accounting
        startTime: startTime,
        endTime: endTime,
        status: 'ACTIVE',
      },
    });

    this.logger.log(`Session ${session.id} activated successfully for ${username}`);
    return {
      success: true,
      session,
      credentials: { username, password }
    };
  }

  async getPackages(vendorId: string) {
    return prisma.package.findMany({ where: { vendorId, active: true } });
  }

  async createPackage(vendorId: string, data: any) {
    return prisma.package.create({
      data: { ...data, vendorId }
    });
  }
}
