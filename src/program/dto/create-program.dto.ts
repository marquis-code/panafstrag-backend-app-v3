import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ['upcoming', 'past'], default: 'upcoming' })
  type: string;

  @ApiProperty({ required: false })
  date?: Date;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  registerLink?: string;
}
