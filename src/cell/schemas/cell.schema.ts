import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CellDocument = Cell & Document;

@Schema({ timestamps: true })
export class Cell {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  description: string;

  @Prop()
  leadName: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: 0 })
  order: number;
}

export const CellSchema = SchemaFactory.createForClass(Cell);
