import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResponsibilityDto {
  @ApiProperty()
  @IsString()
  description: string;
}
