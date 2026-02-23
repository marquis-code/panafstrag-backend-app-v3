import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  sessionId: string; // conversationId or visitorId

  @Prop({ required: false })
  guestName?: string;

  @Prop({ required: false })
  guestEmail?: string;

  @Prop({ required: true, enum: ['page_visit', 'chat_opened', 'chat_message', 'bot_reply', 'form_submit', 'widget_click', 'session_start', 'session_end'] })
  event: string;

  @Prop({ required: false })
  page?: string; // URL or route path

  @Prop({ required: false })
  referrer?: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>; // Extra context

  @Prop({ required: false })
  userAgent?: string;

  @Prop({ required: false })
  ip?: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
