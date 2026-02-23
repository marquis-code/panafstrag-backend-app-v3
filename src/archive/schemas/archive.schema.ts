import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveDocument = Archive & Document;

@Schema({ timestamps: true })
export class Archive {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['speech', 'report', 'media', 'publication'] })
  type: string;

  @Prop()
  description: string;

  @Prop()
  date: Date;

  @Prop({ index: true })
  year: number;

  @Prop({ index: true })
  month: number;

  @Prop()
  fileUrl: string;

  @Prop()
  thumbnailUrl: string;
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
