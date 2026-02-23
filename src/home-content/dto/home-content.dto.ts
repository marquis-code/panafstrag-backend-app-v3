import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class CarouselItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  imgUrl: string;
}

export class CreateHomeContentDto {
  @ApiProperty({ type: [CarouselItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarouselItemDto)
  carousels: CarouselItemDto[];

  @ApiProperty()
  @IsString()
  aboutUsTitle: string;

  @ApiProperty()
  @IsString()
  aboutUsDescription: string;
}

export class UpdateHomeContentDto extends CreateHomeContentDto {}
