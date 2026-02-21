import { ApiProperty } from '@nestjs/swagger';

export class CreateCellDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  leadName?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;
}
