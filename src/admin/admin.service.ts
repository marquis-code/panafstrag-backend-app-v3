import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Board, BoardDocument } from '../board/schemas/board.schema';
import { Cell, CellDocument } from '../cell/schemas/cell.schema';
import { Program, ProgramDocument } from '../program/schemas/program.schema';
import { Archive, ArchiveDocument } from '../archive/schemas/archive.schema';
import { Enquiry, EnquiryDocument } from '../enquiry/schemas/enquiry.schema';
import { Objective, ObjectiveDocument } from '../objective/schemas/objective.schema';
import { OrganogramNode, OrganogramNodeDocument } from '../organogram/schemas/organogram.schema';

@Injectable()
export class AdminService {
  private readonly CACHE_KEY = 'admin_stats';

  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Cell.name) private cellModel: Model<CellDocument>,
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    @InjectModel(Objective.name) private objectiveModel: Model<ObjectiveDocument>,
    @InjectModel(OrganogramNode.name) private organogramModel: Model<OrganogramNodeDocument>,
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

    const [
      boardCount,
      cellCount,
      programCount,
      archiveCount,
      enquiryCount,
      objectiveCount,
      organogramCount,
    ] = await Promise.all([
      this.boardModel.countDocuments().exec().catch(() => 0),
      this.cellModel.countDocuments().exec().catch(() => 0),
      this.programModel.countDocuments().exec().catch(() => 0),
      this.archiveModel.countDocuments().exec().catch(() => 0),
      this.enquiryModel.countDocuments().exec().catch(() => 0),
      this.objectiveModel.countDocuments().exec().catch(() => 0),
      this.organogramModel.countDocuments().exec().catch(() => 0),
    ]);

    const stats = {
      boardCount,
      cellCount,
      programCount,
      archiveCount,
      enquiryCount,
      objectiveCount,
      organogramCount,
    };

    try {
      await this.cacheManager.set(this.CACHE_KEY, stats, 60000); // Cache stats for 1 minute
    } catch (error) {
      console.warn('Cache set failed:', error.message);
    }
    
    return stats;
  }
}
