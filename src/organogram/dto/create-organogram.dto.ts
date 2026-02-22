import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganogramNodeDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: 1 })
  level?: number;

  @ApiProperty({ required: false })
  parentId?: string;

  @ApiProperty({ required: false, default: 0 })
  order?: number;
}
