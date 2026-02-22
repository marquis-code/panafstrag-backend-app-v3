import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsibilityService } from './responsibility.service';
import { ResponsibilityController } from './responsibility.controller';
import { Responsibility, ResponsibilitySchema } from './schemas/responsibility.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Responsibility.name, schema: ResponsibilitySchema }]),
  ],
  controllers: [ResponsibilityController],
  providers: [ResponsibilityService],
  exports: [ResponsibilityService],
})
export class ResponsibilityModule {}
