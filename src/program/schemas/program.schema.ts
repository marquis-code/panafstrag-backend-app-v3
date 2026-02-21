import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgramDocument = Program & Document;

@Schema({ timestamps: true })
export class Program {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['upcoming', 'past'], default: 'upcoming' })
  type: string;

  @Prop()
  date: Date;

  @Prop()
  imageUrl: string;

  @Prop()
  registerLink: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
