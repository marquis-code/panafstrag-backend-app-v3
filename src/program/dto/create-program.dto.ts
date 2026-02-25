import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  theme?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, description: 'Rich HTML content from editor' })
  content?: string;

  @ApiProperty({ required: false })
  startDate?: string;

  @ApiProperty({ required: false })
  endDate?: string;

  @ApiProperty({ type: [String], required: false })
  uploadedDocumentFiles?: string[];

  @ApiProperty({ required: false })
  uploadedVideoUrl?: string;

  @ApiProperty({ required: false })
  zoomMeetingUrl?: string;

  @ApiProperty({ required: false })
  googleMeetUrl?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ type: [String], required: false })
  cloudinary_id?: string[];

  @ApiProperty({ default: 'pending', required: false })
  status?: string;

  @ApiProperty({ enum: ['upcoming', 'past'], default: 'upcoming' })
  type: string;

  @ApiProperty({ required: false })
  date?: Date;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  registerLink?: string;

  @ApiProperty({ type: [Object], required: false })
  nestedProgrammes?: any[];

  @ApiProperty({ required: false })
  year?: number;

  @ApiProperty({ required: false })
  month?: number;

  @ApiProperty({ type: [String], required: false })
  bannerImages?: string[];

  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Array of speakers: { name, role, bio, imageUrl }',
  })
  speakers?: { name: string; role: string; bio: string; imageUrl: string }[];

  @ApiProperty({
    type: [Object],
    required: false,
    description: 'Array of agenda items: { time, title, description }',
  })
  agenda?: { time: string; title: string; description: string }[];
}
