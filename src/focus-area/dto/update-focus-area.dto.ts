import { PartialType } from '@nestjs/swagger';
import { CreateFocusAreaDto } from './create-focus-area.dto';

export class UpdateFocusAreaDto extends PartialType(CreateFocusAreaDto) {}
