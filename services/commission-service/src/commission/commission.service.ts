import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@britespot/database';

const prisma = new PrismaClient();

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  /**
   * Processes the commission split for a successful payment and updates Vendor Wallets.
   * Assumes Britespot takes a fee of 10% or a minimum of KES 2.
   */
  async processPaymentCommission(paymentId: string) {
    this.logger.log(`Processing commission for Payment: ${paymentId}`);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status !== 'SUCCESS') {
      this.logger.error('Invalid payment for commission processing');
      return null;
    }

    // Check if commission already processed
    const existingCommission = await prisma.commission.findUnique({
      where: { paymentId: payment.id },
    });
    if (existingCommission) {
      this.logger.log('Commission already processed for this payment');
      return existingCommission;
    }

    // Logic: 10% or 2 KES minimum
    let britespotFee = payment.amount * 0.10;
    if (britespotFee < 2) britespotFee = 2;
    
    // Ensure fee doesn't exceed amount
    if (britespotFee > payment.amount) britespotFee = payment.amount;

    const vendorAmount = payment.amount - britespotFee;

    // Transaction to update Commission and Wallet atomically
    const result = await prisma.$transaction(async (tx) => {
      const commission = await tx.commission.create({
        data: {
          vendorId: payment.vendorId,
          paymentId: payment.id,
          amount: payment.amount,
          britespotAmount: britespotFee,
          vendorAmount: vendorAmount,
          status: 'PENDING', // Changes to SETTLED when actually paid out via M-Pesa B2B
        },
      });

      // Upsert Wallet
      const wallet = await tx.wallet.upsert({
        where: { vendorId: payment.vendorId },
        update: {
          availableBalance: { increment: vendorAmount },
        },
        create: {
          vendorId: payment.vendorId,
          availableBalance: vendorAmount,
          pendingBalance: 0,
        },
      });

      return { commission, wallet };
    });

    this.logger.log(`Successfully credited KES ${vendorAmount} to Vendor ${payment.vendorId} wallet.`);
    return result;
  }
}
