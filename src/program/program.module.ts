import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Program, ProgramSchema } from './schemas/program.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
