import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsDateString, IsNumber, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgramDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Rich HTML content from editor' })
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

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cloudinary_id?: string[];

  @ApiProperty({ default: 'pending', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ enum: ['upcoming', 'past'], default: 'upcoming' })
  @IsEnum(['upcoming', 'past'])
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registerLink?: string;

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  @IsArray()
  nestedProgrammes?: any[];

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

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bannerImages?: string[];

  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Array of speakers: { name, role, bio, imageUrl }',
  })
  @IsOptional()
  @IsArray()
  speakers?: { name: string; role: string; bio: string; imageUrl: string }[];

  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Array of agenda items: { time, title, description }',
  })
  @IsOptional()
  @IsArray()
  agenda?: { time: string; title: string; description: string }[];
}
