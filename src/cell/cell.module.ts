import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CellService } from './cell.service';
import { CellController } from './cell.controller';
import { Cell, CellSchema } from './schemas/cell.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cell.name, schema: CellSchema }])],
  providers: [CellService],
  controllers: [CellController]
})
export class CellModule {}
