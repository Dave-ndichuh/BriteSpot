import { Controller, Post, Body, Logger, HttpCode } from '@nestjs/common';
import { MpesaService } from './mpesa.service';

@Controller('mpesa')
export class MpesaController {
  private readonly logger = new Logger(MpesaController.name);

  constructor(private readonly mpesaService: MpesaService) {}

  /**
   * Webhook endpoint for STK Push Callbacks
   */
  @Post('callback/stk')
  @HttpCode(200)
  async handleStkCallback(@Body() body: any) {
    this.logger.log(`Received STK Push Callback: ${JSON.stringify(body)}`);
    
    // Safely extract payload
    const callbackData = body?.Body?.stkCallback;
    if (callbackData && callbackData.ResultCode === 0) {
      // Payment Successful
      this.logger.log('Payment Successful. Emitting event to Billing Service...');
      // TODO: Use EventBus or Message Queue (e.g. Redis/RabbitMQ) to notify billing-service
    } else if (callbackData) {
      // Payment Failed
      this.logger.warn(`Payment Failed: ${callbackData.ResultDesc}`);
    }

    // Safaricom expects a success response indicating receipt of webhook
    return { ResultCode: 0, ResultDesc: "Accepted" };
  }

  /**
   * Webhook endpoint for B2B Result
   */
  @Post('callback/b2b/result')
  @HttpCode(200)
  async handleB2BResult(@Body() body: any) {
    this.logger.log(`Received B2B Result Callback: ${JSON.stringify(body)}`);
    // Process B2B Result for vendor commission payouts
    return { ResultCode: 0, ResultDesc: "Accepted" };
  }

  /**
   * Webhook endpoint for B2B Queue Timeout
   */
  @Post('callback/b2b/queue')
  @HttpCode(200)
  async handleB2BQueue(@Body() body: any) {
    this.logger.log(`Received B2B Queue Timeout Callback: ${JSON.stringify(body)}`);
    return { ResultCode: 0, ResultDesc: "Accepted" };
  }
}
