import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  message?: string;

  @Prop()
  messageType?: 'info' | 'warning' | 'error' | 'success';

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Object, default: {} })
  meta?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
