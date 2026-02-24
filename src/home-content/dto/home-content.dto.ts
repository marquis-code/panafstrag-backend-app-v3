import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutUsContextImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutUsContextText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupFunction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupMembership?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupLeadership?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupFees?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  websiteHeaderText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutUsSubTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objectivesTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objectivesSubTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibilitiesTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibilitiesSubTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  programsTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuresTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuresSubTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  focusAreasPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  focusAreasPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  programsPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  programsPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  archivesPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  archivesPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  boardPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  boardPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organogramPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organogramPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cellsPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cellsPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPageDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupsPageTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  languageGroupsPageDescription?: string;
}

export class UpdateHomeContentDto extends CreateHomeContentDto {}
