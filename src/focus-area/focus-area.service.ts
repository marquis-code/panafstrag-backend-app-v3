import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FocusArea, FocusAreaDocument } from './schemas/focus-area.schema';
import { CreateFocusAreaDto } from './dto/create-focus-area.dto';
import { UpdateFocusAreaDto } from './dto/update-focus-area.dto';

@Injectable()
export class FocusAreaService {
  private readonly CACHE_KEY = 'focus_areas_all';

  constructor(
    @InjectModel(FocusArea.name) private focusAreaModel: Model<FocusAreaDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createFocusAreaDto: CreateFocusAreaDto): Promise<FocusAreaDocument> {
    const created = new this.focusAreaModel(createFocusAreaDto);
    const saved = await created.save();
    await this.cacheManager.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(): Promise<FocusAreaDocument[]> {
    const cachedData = await this.cacheManager.get<FocusAreaDocument[]>(this.CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.focusAreaModel.find().exec();
    await this.cacheManager.set(this.CACHE_KEY, data);
    return data;
  }

  async findOne(id: string): Promise<FocusAreaDocument> {
    const doc = await this.focusAreaModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Focus Area with ID ${id} not found`);
    }
    return doc;
  }

  async update(id: string, updateFocusAreaDto: UpdateFocusAreaDto): Promise<FocusAreaDocument> {
    const updated = await this.focusAreaModel
      .findByIdAndUpdate(id, updateFocusAreaDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Focus Area with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return updated;
  }

  async remove(id: string): Promise<FocusAreaDocument> {
    const deleted = await this.focusAreaModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Focus Area with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return deleted;
  }
}
