import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveDocument = Archive & Document;

@Schema({ timestamps: true })
export class Archive {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['speech', 'report', 'media', 'publication', 'programme', 'research'] })
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

  // Additional fields for archived programmes
  @Prop()
  theme?: string;

  @Prop()
  content?: string;

  @Prop()
  startDate?: string;

  @Prop()
  endDate?: string;

  @Prop([String])
  uploadedDocumentFiles?: string[];

  @Prop()
  uploadedVideoUrl?: string;

  @Prop()
  zoomMeetingUrl?: string;

  @Prop()
  googleMeetUrl?: string;

  @Prop()
  location?: string;

  @Prop([String])
  cloudinary_id?: string;

  @Prop({ default: 'pending' })
  status?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  registerLink?: string;

  @Prop([Object])
  nestedProgrammes?: any[];

  @Prop({ type: [String], default: [] })
  bannerImages?: string[];

  @Prop({
    type: [{
      name: { type: String },
      role: { type: String },
      bio: { type: String },
      imageUrl: { type: String },
    }],
    default: [],
  })
  speakers?: { name: string; role: string; bio: string; imageUrl: string }[];

  @Prop({
    type: [{
      time: { type: String },
      title: { type: String },
      description: { type: String },
    }],
    default: [],
  })
  agenda?: { time: string; title: string; description: string }[];
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
