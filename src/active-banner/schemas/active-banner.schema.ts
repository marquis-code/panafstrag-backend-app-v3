import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActiveBannerDocument = ActiveBanner & Document;

@Schema({ timestamps: true })
export class ActiveBanner {
  @Prop({ type: Types.ObjectId, ref: 'Program', required: true })
  programId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const ActiveBannerSchema = SchemaFactory.createForClass(ActiveBanner);
