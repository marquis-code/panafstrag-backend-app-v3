import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LanguageGroupDocument = LanguageGroup & Document;

@Schema({ timestamps: true })
export class LanguageGroup {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop()
  imageUrl: string;
}

export const LanguageGroupSchema = SchemaFactory.createForClass(LanguageGroup);
