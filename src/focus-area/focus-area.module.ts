import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FocusAreaController } from './focus-area.controller';
import { FocusAreaService } from './focus-area.service';
import { FocusArea, FocusAreaSchema } from './schemas/focus-area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FocusArea.name, schema: FocusAreaSchema }]),
  ],
  controllers: [FocusAreaController],
  providers: [FocusAreaService],
  exports: [FocusAreaService],
})
export class FocusAreaModule {}
