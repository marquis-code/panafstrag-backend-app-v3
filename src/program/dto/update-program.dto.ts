import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgramDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  theme?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
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

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  type?: string;

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

  @ApiProperty({ type: [Object], required: false })
  speakers?: { name: string; role: string; bio: string; imageUrl: string }[];

  @ApiProperty({ type: [Object], required: false })
  agenda?: { time: string; title: string; description: string }[];
}
