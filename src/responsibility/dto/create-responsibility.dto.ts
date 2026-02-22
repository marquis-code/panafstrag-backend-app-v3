import { ApiProperty } from '@nestjs/swagger';

export class CreateResponsibilityDto {
  @ApiProperty()
  description: string;
}
