import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { OrganogramNode, OrganogramNodeDocument } from './schemas/organogram.schema';
import { CreateOrganogramNodeDto } from './dto/create-organogram.dto';
import { UpdateOrganogramNodeDto } from './dto/update-organogram.dto';

@Injectable()
export class OrganogramService {
  private readonly CACHE_KEY = 'organogram_all';

  constructor(
    @InjectModel(OrganogramNode.name) private organogramModel: Model<OrganogramNodeDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDto: CreateOrganogramNodeDto): Promise<OrganogramNodeDocument> {
    const created = new this.organogramModel(createDto);
    const saved = await created.save();
    await this.cacheManager.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(): Promise<OrganogramNodeDocument[]> {
    const cachedData = await this.cacheManager.get<OrganogramNodeDocument[]>(this.CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.organogramModel.find().sort({ level: 1, order: 1 }).exec();
    await this.cacheManager.set(this.CACHE_KEY, data);
    return data;
  }

  async findOne(id: string): Promise<OrganogramNodeDocument> {
    const doc = await this.organogramModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Organogram node with ID ${id} not found`);
    }
    return doc;
  }

  async update(id: string, updateDto: UpdateOrganogramNodeDto): Promise<OrganogramNodeDocument> {
    const updated = await this.organogramModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Organogram node with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return updated;
  }

  async remove(id: string): Promise<OrganogramNodeDocument> {
    const deleted = await this.organogramModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Organogram node with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return deleted;
  }
}
