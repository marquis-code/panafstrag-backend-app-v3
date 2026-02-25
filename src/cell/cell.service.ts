import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Cell, CellDocument } from './schemas/cell.schema';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

@Injectable()
export class CellService {
  private readonly CACHE_KEY = 'cells_all';

  constructor(
    @InjectModel(Cell.name) private cellModel: Model<CellDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCellDto: CreateCellDto): Promise<CellDocument> {
    const createdCell = new this.cellModel(createCellDto);
    const saved = await createdCell.save();
    await this.cacheManager.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(): Promise<CellDocument[]> {
    const cachedData = await this.cacheManager.get<CellDocument[]>(this.CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.cellModel.find().sort({ order: 1, createdAt: 1 }).exec();
    await this.cacheManager.set(this.CACHE_KEY, data);
    return data;
  }

  async findOne(id: string): Promise<CellDocument> {
    const cell = await this.cellModel.findById(id).exec();
    if (!cell) {
      throw new NotFoundException(`Cell with ID ${id} not found`);
    }
    return cell;
  }

  async update(id: string, updateCellDto: UpdateCellDto): Promise<CellDocument> {
    const updatedCell = await this.cellModel
      .findByIdAndUpdate(id, updateCellDto, { new: true })
      .exec();
    if (!updatedCell) {
      throw new NotFoundException(`Cell with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return updatedCell;
  }

  async remove(id: string): Promise<CellDocument> {
    const deletedCell = await this.cellModel.findByIdAndDelete(id).exec();
    if (!deletedCell) {
      throw new NotFoundException(`Cell with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return deletedCell;
  }
}
