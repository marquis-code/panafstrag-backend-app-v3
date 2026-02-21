import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ type: [String], required: false })
  duties?: string[];
}
