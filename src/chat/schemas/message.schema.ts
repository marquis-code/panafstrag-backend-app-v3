import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  sender?: string;

  @Prop({ required: false })
  guestName?: string;

  @Prop({ required: false })
  guestEmail?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['text', 'image'], default: 'text' })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  recipient?: string;

  @Prop({ required: false })
  recipientEmail?: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
