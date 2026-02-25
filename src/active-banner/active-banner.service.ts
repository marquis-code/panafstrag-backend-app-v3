import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActiveBanner, ActiveBannerDocument } from './schemas/active-banner.schema';
import { CreateActiveBannerDto } from './dto/create-active-banner.dto';
import { UpdateActiveBannerDto } from './dto/update-active-banner.dto';

@Injectable()
export class ActiveBannerService {
  constructor(
    @InjectModel(ActiveBanner.name) private activeBannerModel: Model<ActiveBannerDocument>,
  ) {}

  async create(dto: CreateActiveBannerDto): Promise<ActiveBannerDocument> {
    const banner = new this.activeBannerModel(dto);
    return banner.save();
  }

  async findAll(): Promise<ActiveBannerDocument[]> {
    return this.activeBannerModel
      .find()
      .populate('programId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActive(): Promise<ActiveBannerDocument | null> {
    const now = new Date();
    return this.activeBannerModel
      .findOne({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .populate('programId')
      .exec();
  }

  async findOne(id: string): Promise<ActiveBannerDocument> {
    const banner = await this.activeBannerModel.findById(id).populate('programId').exec();
    if (!banner) {
      throw new NotFoundException(`Active banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: string, dto: UpdateActiveBannerDto): Promise<ActiveBannerDocument> {
    const updated = await this.activeBannerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('programId')
      .exec();
    if (!updated) {
      throw new NotFoundException(`Active banner with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<ActiveBannerDocument> {
    const deleted = await this.activeBannerModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Active banner with ID ${id} not found`);
    }
    return deleted;
  }

  // Cron job: runs every hour to deactivate expired banners
  @Cron(CronExpression.EVERY_HOUR)
  async expireOldBanners() {
    const now = new Date();
    const result = await this.activeBannerModel.updateMany(
      { isActive: true, endDate: { $lt: now } },
      { $set: { isActive: false } },
    );
    if (result.modifiedCount > 0) {
      console.log(`[ActiveBanner] ⏰ Expired ${result.modifiedCount} banner(s)`);
    }
  }
}
