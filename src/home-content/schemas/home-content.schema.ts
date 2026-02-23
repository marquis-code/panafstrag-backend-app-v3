import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeContentDocument = HomeContent & Document;

@Schema({ _id: false })
class CarouselItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imgUrl: string;
}

const CarouselItemSchema = SchemaFactory.createForClass(CarouselItem);

@Schema({ timestamps: true })
export class HomeContent {
  @Prop({ type: [CarouselItemSchema], default: [] })
  carousels: CarouselItem[];

  @Prop({ required: true })
  aboutUsDescription: string;

  @Prop({ required: true })
  aboutUsTitle: string;
}

export const HomeContentSchema = SchemaFactory.createForClass(HomeContent);
