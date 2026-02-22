import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganogramNodeDocument = OrganogramNode & Document;

@Schema({ timestamps: true })
export class OrganogramNode {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  level: number; // 1 for top level, 2 for second level, etc.

  @Prop()
  parentId: string; // ID of the parent node

  @Prop()
  order: number;
}

export const OrganogramNodeSchema = SchemaFactory.createForClass(OrganogramNode);
