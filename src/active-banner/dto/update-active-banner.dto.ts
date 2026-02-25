import { ApiProperty } from '@nestjs/swagger';

export class UpdateActiveBannerDto {
  @ApiProperty({ required: false })
  programId?: string;

  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({ required: false })
  isActive?: boolean;
}
