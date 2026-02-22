import { PartialType } from '@nestjs/swagger';
import { CreateLanguageGroupDto } from './create-language-group.dto';

export class UpdateLanguageGroupDto extends PartialType(CreateLanguageGroupDto) {}
