import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectiveDto {
  @ApiProperty()
  description: string;
}
