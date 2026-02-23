import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BotConfigDocument = BotConfig & Document;

@Schema({ timestamps: true })
export class BotConfig {
  @Prop({ required: true, unique: true })
  key: string; // e.g. 'welcome', 'page_programs', 'faq_membership'

  @Prop({ required: true, enum: ['greeting', 'page_trigger', 'faq', 'fallback'] })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  keywords: string[]; // For FAQ matching

  @Prop({ type: [String], default: [] })
  quickReplies: string[];

  @Prop({ required: false })
  pagePath?: string; // For page_trigger type, e.g. '/programs'

  @Prop({ default: 5000 })
  delayMs: number; // Delay before showing

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  priority: number; // Higher = matched first
}

export const BotConfigSchema = SchemaFactory.createForClass(BotConfig);
