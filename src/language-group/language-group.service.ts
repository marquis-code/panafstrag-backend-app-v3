import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { LanguageGroup, LanguageGroupDocument } from './schemas/language-group.schema';
import { CreateLanguageGroupDto } from './dto/create-language-group.dto';
import { UpdateLanguageGroupDto } from './dto/update-language-group.dto';

@Injectable()
export class LanguageGroupService {
  private readonly CACHE_KEY = 'language_groups_all';

  constructor(
    @InjectModel(LanguageGroup.name) private languageGroupModel: Model<LanguageGroupDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createLanguageGroupDto: CreateLanguageGroupDto): Promise<LanguageGroupDocument> {
    const created = new this.languageGroupModel(createLanguageGroupDto);
    const saved = await created.save();
    await this.cacheManager.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(): Promise<LanguageGroupDocument[]> {
    const cachedData = await this.cacheManager.get<LanguageGroupDocument[]>(this.CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.languageGroupModel.find().exec();
    await this.cacheManager.set(this.CACHE_KEY, data);
    return data;
  }

  async findOne(id: string): Promise<LanguageGroupDocument> {
    const doc = await this.languageGroupModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Language Group with ID ${id} not found`);
    }
    return doc;
  }

  async update(id: string, updateLanguageGroupDto: UpdateLanguageGroupDto): Promise<LanguageGroupDocument> {
    const updated = await this.languageGroupModel
      .findByIdAndUpdate(id, updateLanguageGroupDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Language Group with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return updated;
  }

  async remove(id: string): Promise<LanguageGroupDocument> {
    const deleted = await this.languageGroupModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Language Group with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return deleted;
  }
}
