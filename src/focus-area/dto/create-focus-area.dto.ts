import { ApiProperty } from '@nestjs/swagger';

export class CreateFocusAreaDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
