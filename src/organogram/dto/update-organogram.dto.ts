import { PartialType } from '@nestjs/swagger';
import { CreateOrganogramNodeDto } from './create-organogram.dto';

export class UpdateOrganogramNodeDto extends PartialType(CreateOrganogramNodeDto) {}
