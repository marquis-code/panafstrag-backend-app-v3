import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponsibilityDocument = Responsibility & Document;

@Schema({ timestamps: true })
export class Responsibility {
  @Prop({ required: true })
  description: string;
}

export const ResponsibilitySchema = SchemaFactory.createForClass(Responsibility);
