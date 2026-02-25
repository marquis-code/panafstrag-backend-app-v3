import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArchiveDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ['speech', 'report', 'media', 'publication'] })
  @IsEnum(['speech', 'report', 'media', 'publication'])
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
