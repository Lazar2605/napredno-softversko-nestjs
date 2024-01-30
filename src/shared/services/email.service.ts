import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from '../../config/available-configs';
import { EmailData } from '../types/email-data.types';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    const sendgridApiKey = this.configService.get<string>(
      AvailableConfigs.SENDGRID_API_KEY,
    );
    sgMail.setApiKey(sendgridApiKey);
  }

  async sendEmail(emailData: EmailData) {
    const from = this.configService.get<string>(
      AvailableConfigs.SENDGRID_SENDER_EMAIL,
    );
    await sgMail.send({ from, ...emailData });
  }
}