import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BillingService } from './billing.service';

@Module({
  imports: [HttpModule],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
