import { ApiProperty } from '@nestjs/swagger';

export class CreateArchiveDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ enum: ['speech', 'report', 'media', 'publication'] })
  type: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  date?: Date;

  @ApiProperty({ required: false })
  year?: number;

  @ApiProperty({ required: false })
  month?: number;

  @ApiProperty({ required: false })
  fileUrl?: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;
}
