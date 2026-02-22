import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  email?: string[];

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  university?: string;

  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({ required: false })
  faculty?: string;

  @ApiProperty({ required: false })
  position?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ required: false })
  dateJoined?: string;

  @ApiProperty({ required: false })
  cloudinary_id?: string;

  @ApiProperty({ type: [String], required: false })
  duties?: string[];
}
