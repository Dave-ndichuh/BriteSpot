import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);

  // Daraja Sandbox Base URL
  private readonly baseUrl = 'https://sandbox.safaricom.co.ke';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Generates a Daraja access token.
   */
  private async getAccessToken(consumerKey: string, consumerSecret: string): Promise<string> {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        })
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa access token', error);
      throw error;
    }
  }

  /**
   * Initiates an STK Push (Lipa na M-Pesa Online) request for Hotspot Payments.
   */
  async initiateStkPush(params: {
    consumerKey: string;
    consumerSecret: string;
    shortcode: string;
    passkey: string;
    amount: number;
    phoneNumber: string;
    callbackUrl: string;
    accountReference: string;
    transactionDesc: string;
  }) {
    const token = await this.getAccessToken(params.consumerKey, params.consumerSecret);
    const timestamp = this.generateTimestamp();
    const password = Buffer.from(`${params.shortcode}${params.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: params.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: params.amount,
      PartyA: params.phoneNumber,
      PartyB: params.shortcode,
      PhoneNumber: params.phoneNumber,
      CallBackURL: params.callbackUrl,
      AccountReference: params.accountReference,
      TransactionDesc: params.transactionDesc,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error('STK Push failed', error);
      throw error;
    }
  }

  /**
   * Generates the Daraja timestamp format: YYYYMMDDHHmmss
   */
  private generateTimestamp(): string {
    const now = new Date();
    return now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
  }

  /**
   * B2B BusinessBuyGoods logic for vendor settlements and commission payouts.
   */
  async initiateBusinessBuyGoods(params: {
    consumerKey: string;
    consumerSecret: string;
    initiatorName: string;
    securityCredential: string;
    amount: number;
    partyA: string;
    partyB: string;
    accountReference: string;
    requester: string;
    remarks: string;
    queueTimeOutUrl: string;
    resultUrl: string;
  }) {
    const token = await this.getAccessToken(params.consumerKey, params.consumerSecret);

    const payload = {
      Initiator: params.initiatorName,
      SecurityCredential: params.securityCredential,
      CommandID: 'BusinessBuyGoods',
      SenderIdentifierType: '4',
      RecieverIdentifierType: '4',
      Amount: params.amount,
      PartyA: params.partyA,
      PartyB: params.partyB,
      AccountReference: params.accountReference,
      Requester: params.requester,
      Remarks: params.remarks,
      QueueTimeOutURL: params.queueTimeOutUrl,
      ResultURL: params.resultUrl,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/mpesa/b2b/v1/paymentrequest`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error('Business Buy Goods failed', error);
      throw error;
    }
  }
}
