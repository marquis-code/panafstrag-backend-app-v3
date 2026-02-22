import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string[];

  @Prop()
  avatar: string;

  @Prop()
  university: string;

  @Prop()
  department: string;

  @Prop()
  faculty: string;

  @Prop()
  position: string;

  @Prop()
  bio: string;

  @Prop()
  dateJoined: string;

  @Prop()
  cloudinary_id: string;

  @Prop([String])
  duties: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
