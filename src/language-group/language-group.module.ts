import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageGroupController } from './language-group.controller';
import { LanguageGroupService } from './language-group.service';
import { LanguageGroup, LanguageGroupSchema } from './schemas/language-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LanguageGroup.name, schema: LanguageGroupSchema }]),
  ],
  controllers: [LanguageGroupController],
  providers: [LanguageGroupService],
  exports: [LanguageGroupService],
})
export class LanguageGroupModule {}
