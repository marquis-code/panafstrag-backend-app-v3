import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActiveBannerService } from './active-banner.service';
import { ActiveBannerController } from './active-banner.controller';
import { ActiveBanner, ActiveBannerSchema } from './schemas/active-banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActiveBanner.name, schema: ActiveBannerSchema }]),
  ],
  controllers: [ActiveBannerController],
  providers: [ActiveBannerService],
  exports: [ActiveBannerService],
})
export class ActiveBannerModule {}
