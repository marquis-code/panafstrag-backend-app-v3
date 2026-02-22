import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Board, BoardDocument } from '../board/schemas/board.schema';
import { Cell, CellDocument } from '../cell/schemas/cell.schema';
import { Program, ProgramDocument } from '../program/schemas/program.schema';
import { Archive, ArchiveDocument } from '../archive/schemas/archive.schema';

@Injectable()
export class AdminService {
  private readonly CACHE_KEY = 'admin_stats';

  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Cell.name) private cellModel: Model<CellDocument>,
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getStats() {
    try {
      const cachedStats = await this.cacheManager.get(this.CACHE_KEY);
      if (cachedStats) {
        return cachedStats;
      }
    } catch (error) {
      console.warn('Cache get failed:', error.message);
    }

    const [boardCount, cellCount, programCount, archiveCount] = await Promise.all([
      this.boardModel.countDocuments().exec(),
      this.cellModel.countDocuments().exec(),
      this.programModel.countDocuments().exec(),
      this.archiveModel.countDocuments().exec(),
    ]);

    const stats = {
      boardCount,
      cellCount,
      programCount,
      archiveCount,
    };

    try {
      await this.cacheManager.set(this.CACHE_KEY, stats, 60000); // Cache stats for 1 minute
    } catch (error) {
      console.warn('Cache set failed:', error.message);
    }
    
    return stats;
  }
}
