import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@britespot/database';

const prisma = new PrismaClient();

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  async getVendorMetrics(vendorId: string) {
    this.logger.log(`Fetching metrics for vendor ${vendorId}`);

    // Get Wallet Balance
    const wallet = await prisma.wallet.findUnique({
      where: { vendorId },
    });

    // Get active sessions
    const activeSessions = await prisma.session.count({
      where: { vendorId, status: 'ACTIVE' },
    });

    // Get total revenue for the vendor
    const totalRevenue = await prisma.commission.aggregate({
      where: { vendorId },
      _sum: { vendorAmount: true },
    });

    // Get recent transactions for charts
    const recentCommissions = await prisma.commission.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      take: 7,
      include: {
        payment: { select: { amount: true } }
      }
    });

    const chartData = recentCommissions.map(c => ({
      date: c.createdAt.toISOString().split('T')[0],
      revenue: c.vendorAmount,
    }));

    return {
      walletBalance: wallet?.availableBalance || 0,
      activeSessions,
      totalRevenue: totalRevenue._sum.vendorAmount || 0,
      chartData: chartData.reverse(), // oldest to newest for charts
    };
  }
}
