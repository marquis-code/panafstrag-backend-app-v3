import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';
import { Archive, ArchiveSchema } from './schemas/archive.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }])],
  providers: [ArchiveService],
  controllers: [ArchiveController]
})
export class ArchiveModule {}
