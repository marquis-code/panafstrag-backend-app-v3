import { ApiProperty } from '@nestjs/swagger';

export class CreateActiveBannerDto {
  @ApiProperty({ description: 'Program ID to feature as banner' })
  programId: string;

  @ApiProperty({ description: 'When the banner starts displaying' })
  startDate: Date;

  @ApiProperty({ description: 'When the banner stops displaying' })
  endDate: Date;

  @ApiProperty({ default: true, required: false })
  isActive?: boolean;
}
