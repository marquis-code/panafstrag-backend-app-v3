import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageGroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;
}
