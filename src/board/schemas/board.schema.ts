import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  bio: string;

  @Prop()
  imageUrl: string;

  @Prop([String])
  duties: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
