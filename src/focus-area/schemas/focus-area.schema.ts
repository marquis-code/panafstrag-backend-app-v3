import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FocusAreaDocument = FocusArea & Document;

@Schema({ timestamps: true })
export class FocusArea {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const FocusAreaSchema = SchemaFactory.createForClass(FocusArea);
