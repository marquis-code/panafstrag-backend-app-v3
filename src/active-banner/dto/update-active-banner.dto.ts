import { PartialType } from '@nestjs/swagger';
import { CreateActiveBannerDto } from './create-active-banner.dto';

export class UpdateActiveBannerDto extends PartialType(CreateActiveBannerDto) {}
