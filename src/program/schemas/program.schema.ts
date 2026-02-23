import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgramDocument = Program & Document;

@Schema({ timestamps: true })
export class Program {
  @Prop({ required: true })
  title: string;

  @Prop()
  theme: string;

  @Prop()
  description: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop([String])
  uploadedDocumentFiles: string[];

  @Prop()
  uploadedVideoUrl: string;

  @Prop()
  zoomMeetingUrl: string;

  @Prop([String])
  cloudinary_id: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ required: true, enum: ['upcoming', 'past'], default: 'upcoming' })
  type: string;

  @Prop()
  date: Date;

  @Prop()
  imageUrl: string;

  @Prop()
  registerLink: string;

  @Prop({ required: false })
  year?: number;

  @Prop({ required: false })
  month?: number;

  @Prop([Object])
  nestedProgrammes: any[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
