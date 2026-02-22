import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { Objective, ObjectiveSchema } from './schemas/objective.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Objective.name, schema: ObjectiveSchema }]),
  ],
  controllers: [ObjectiveController],
  providers: [ObjectiveService],
  exports: [ObjectiveService],
})
export class ObjectiveModule {}
