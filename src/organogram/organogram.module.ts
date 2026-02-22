import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganogramController } from './organogram.controller';
import { OrganogramService } from './organogram.service';
import { OrganogramNode, OrganogramNodeSchema } from './schemas/organogram.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrganogramNode.name, schema: OrganogramNodeSchema }]),
  ],
  controllers: [OrganogramController],
  providers: [OrganogramService],
  exports: [OrganogramService],
})
export class OrganogramModule {}
