import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectiveDocument = Objective & Document;

@Schema({ timestamps: true })
export class Objective {
  @Prop({ required: true })
  description: string;
}

export const ObjectiveSchema = SchemaFactory.createForClass(Objective);
