import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  // If it's a group conversation, `name` and `isGroup` are used
  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  name?: string;

  // participants holds User ObjectIds
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: mongoose.Types.ObjectId[];

  @Prop()
  avatar?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  latestMessage?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
