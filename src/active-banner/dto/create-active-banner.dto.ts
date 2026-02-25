import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActiveBannerDto {
  @ApiProperty({ description: 'Program ID to feature as banner' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ description: 'When the banner starts displaying' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'When the banner stops displaying' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
