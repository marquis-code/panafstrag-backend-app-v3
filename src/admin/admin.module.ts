import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Board, BoardSchema } from '../board/schemas/board.schema';
import { Cell, CellSchema } from '../cell/schemas/cell.schema';
import { Program, ProgramSchema } from '../program/schemas/program.schema';
import { Archive, ArchiveSchema } from '../archive/schemas/archive.schema';
import { Enquiry, EnquirySchema } from '../enquiry/schemas/enquiry.schema';
import { Objective, ObjectiveSchema } from '../objective/schemas/objective.schema';
import { OrganogramNode, OrganogramNodeSchema } from '../organogram/schemas/organogram.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Cell.name, schema: CellSchema },
      { name: Program.name, schema: ProgramSchema },
      { name: Archive.name, schema: ArchiveSchema },
      { name: Enquiry.name, schema: EnquirySchema },
      { name: Objective.name, schema: ObjectiveSchema },
      { name: OrganogramNode.name, schema: OrganogramNodeSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
