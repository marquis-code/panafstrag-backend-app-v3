import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArchiveDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ['speech', 'report', 'media', 'publication', 'programme', 'research'] })
  @IsEnum(['speech', 'report', 'media', 'publication', 'programme', 'research'])
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  uploadedDocumentFiles?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uploadedVideoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zoomMeetingUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  googleMeetUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registerLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  bannerImages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  speakers?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  agenda?: any[];
}
