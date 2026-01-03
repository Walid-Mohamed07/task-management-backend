import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';
import twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message?: string,
    messageType?: 'info' | 'warning' | 'error' | 'success',
    meta?: Record<string, any>,
  ): Promise<NotificationDocument> {
    const created = await this.notificationModel.create({
      userId,
      title,
      message,
      messageType,
      meta,
    });

    // Try to deliver via email / whatsapp when possible
    try {
      const user = await this.userService.findOne(userId);
      if (user?.email) {
        this.sendEmail(user.email, title, message || '');
      }
      if (user?.phone) {
        this.sendWhatsApp(user.phone, message || title);
      }
    } catch (err: any) {
      this.logger.warn(
        `Could not deliver external notifications: ${err?.message ?? String(err)}`,
      );
    }

    return created;
  }

  async findAll(): Promise<NotificationDocument[]> {
    return this.notificationModel.find().exec();
  }

  async findByUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec();
  }

  async update(
    id: string,
    dto: Partial<Record<string, any>>,
  ): Promise<NotificationDocument | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const host = process.env.SMTP_HOST;
    if (!host) {
      this.logger.debug('SMTP not configured; skipping email');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
      });
      this.logger.debug(`Email sent to ${to}`);
    } catch (err: any) {
      this.logger.warn(
        `Failed to send email to ${to}: ${err?.message ?? String(err)}`,
      );
    }
  }

  private async sendWhatsApp(phone: string, message: string) {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;
    if (!sid || !token || !from) {
      this.logger.debug('Twilio not configured; skipping WhatsApp');
      return;
    }

    try {
      const client = twilio(sid, token);
      await client.messages.create({
        from: `whatsapp:${from}`,
        to: `whatsapp:${phone}`,
        body: message,
      });
      this.logger.debug(`WhatsApp sent to ${phone}`);
    } catch (err: any) {
      this.logger.warn(
        `Failed to send WhatsApp to ${phone}: ${err?.message ?? String(err)}`,
      );
    }
  }
}
