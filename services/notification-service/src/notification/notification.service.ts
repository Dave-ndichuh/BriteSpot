import { Injectable, Logger } from '@nestjs/common';
import * as AfricasTalking from 'africastalking';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private africasTalking;
  private mailtrapClient;

  constructor() {
    // Initialize Africa's Talking
    this.africasTalking = AfricasTalking({
      apiKey: process.env.AT_API_KEY || 'atsk_0dd832dd0e6751d7e60f5fda75ee72e8f034c9eee7fdb25d6f5e3baaf0d45981128af5cb',
      username: process.env.AT_USERNAME || 'sandbox',
    });

    // Initialize Mailtrap
    this.mailtrapClient = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN || '4770f2e371a31288d8c725e9bf204e60',
    });
  }

  async sendSMS(to: string, message: string) {
    try {
      this.logger.log(`Sending SMS to ${to}`);
      const sms = this.africasTalking.SMS;
      const response = await sms.send({
        to: [to],
        message: message,
      });
      this.logger.log(`SMS Response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendEmail(toEmail: string, subject: string, text: string) {
    try {
      this.logger.log(`Sending Email to ${toEmail}`);
      const sender = { email: 'hello@demomailtrap.co', name: 'Britespot Notifications' };
      const recipients = [{ email: toEmail }];
      
      const response = await this.mailtrapClient.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        category: 'Notification',
      });
      this.logger.log(`Email Response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send Email to ${toEmail}: ${error.message}`);
      throw error;
    }
  }

  // Common notification events
  async notifyPaymentSuccess(phone: string, email: string, amount: number, packageDetails: string) {
    const message = `Britespot: Your payment of KES ${amount} for ${packageDetails} was successful. You are now connected.`;
    if (phone) await this.sendSMS(phone, message);
    if (email) await this.sendEmail(email, 'Payment Successful', message);
  }
}
