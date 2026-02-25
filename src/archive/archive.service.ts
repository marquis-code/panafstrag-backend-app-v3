import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Archive, ArchiveDocument } from './schemas/archive.schema';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Injectable()
export class ArchiveService {
  private readonly CACHE_KEY = 'archives_all';

  constructor(
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createArchiveDto: CreateArchiveDto): Promise<ArchiveDocument> {
    const createdArchive = new this.archiveModel(createArchiveDto);
    const saved = await createdArchive.save();
    await this.cacheManager.clear();
    return saved;
  }

  async findAll(filters?: { type?: string; year?: number; month?: number }): Promise<ArchiveDocument[]> {
    const cacheKey = filters 
      ? `${this.CACHE_KEY}_${filters.type || 'all'}_${filters.year || 'all'}_${filters.month || 'all'}`
      : this.CACHE_KEY;

    const cachedData = await this.cacheManager.get<ArchiveDocument[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query: any = {};
    if (filters?.type && filters.type !== 'all') query.type = filters.type;
    if (filters?.year) query.year = filters.year;
    if (filters?.month) query.month = filters.month;

    const data = await this.archiveModel.find(query).sort({ date: -1, createdAt: -1 }).exec();
    await this.cacheManager.set(cacheKey, data);
    return data;
  }

  async findOne(id: string): Promise<ArchiveDocument> {
    const archive = await this.archiveModel.findById(id).exec();
    if (!archive) {
      throw new NotFoundException(`Archive entry with ID ${id} not found`);
    }
    return archive;
  }

  async update(id: string, updateArchiveDto: UpdateArchiveDto): Promise<ArchiveDocument> {
    const updatedArchive = await this.archiveModel
      .findByIdAndUpdate(id, updateArchiveDto, { new: true })
      .exec();
    if (!updatedArchive) {
      throw new NotFoundException(`Archive entry with ID ${id} not found`);
    }
    await this.cacheManager.clear();
    return updatedArchive;
  }

  async remove(id: string): Promise<ArchiveDocument> {
    const deletedArchive = await this.archiveModel.findByIdAndDelete(id).exec();
    if (!deletedArchive) {
      throw new NotFoundException(`Archive entry with ID ${id} not found`);
    }
    await this.cacheManager.clear();
    return deletedArchive;
  }
}
