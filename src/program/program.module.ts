import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Program, ProgramSchema } from './schemas/program.schema';
import { Archive, ArchiveSchema } from '../archive/schemas/archive.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Program.name, schema: ProgramSchema },
      { name: Archive.name, schema: ArchiveSchema }
    ])
  ],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
