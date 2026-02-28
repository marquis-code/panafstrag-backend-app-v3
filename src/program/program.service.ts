import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Program, ProgramDocument } from './schemas/program.schema';
import { Archive, ArchiveDocument } from '../archive/schemas/archive.schema';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramService {
  private readonly CACHE_KEY = 'programs_all';

  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Running daily archiving job...');
    await this.archiveOldPrograms();
  }

  async archiveOldPrograms() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Find programs older than 1 month
    const oldPrograms = await this.programModel.find({
      date: { $lt: oneMonthAgo },
    }).exec();

    if (oldPrograms.length === 0) {
      console.log('No programs to archive.');
      return;
    }

    console.log(`Archiving ${oldPrograms.length} programs...`);

    for (const program of oldPrograms) {
      const programObj = program.toObject();
      const archiveData = {
        ...programObj,
        _id: undefined, // Let mongoose generate a new ID for the archive
        type: 'programme',
        // Preserve original ID in some way if needed, or just let it be a new entry
      };

      await new this.archiveModel(archiveData).save();
      await this.programModel.findByIdAndDelete(program._id).exec();
    }

    console.log('Archiving complete.');
    await this.cacheManager.clear();
  }

  async create(createProgramDto: CreateProgramDto): Promise<ProgramDocument> {
    const createdProgram = new this.programModel(createProgramDto);
    const saved = await createdProgram.save();
    await this.cacheManager.clear();
    return saved;
  }

  async findAll(query?: { type?: string; year?: number; month?: number; includeAll?: boolean }): Promise<ProgramDocument[]> {
    const cacheKey = `${this.CACHE_KEY}_${JSON.stringify(query || {})}`;
    const cachedPrograms = await this.cacheManager.get<ProgramDocument[]>(cacheKey);
    if (cachedPrograms) {
      return cachedPrograms;
    }

    const filter: any = {};
    if (query?.type && query.type !== 'all') filter.type = query.type;
    if (query?.year) filter.year = Number(query.year);
    if (query?.month) filter.month = Number(query.month);

    // By default, only return programs from the last month or upcoming
    if (!query?.includeAll && !query?.year && !query?.month) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filter.date = { $gte: oneMonthAgo };
    }

    const programs = await this.programModel.find(filter).sort({ date: -1 }).exec();
    await this.cacheManager.set(cacheKey, programs);
    return programs;
  }

  async findOne(id: string): Promise<ProgramDocument> {
    const program = await this.programModel.findById(id).exec();
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<ProgramDocument> {
    const updatedProgram = await this.programModel
      .findByIdAndUpdate(id, updateProgramDto, { new: true })
      .exec();
    if (!updatedProgram) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    await this.cacheManager.clear();
    return updatedProgram;
  }

  async remove(id: string): Promise<ProgramDocument> {
    const deletedProgram = await this.programModel.findByIdAndDelete(id).exec();
    if (!deletedProgram) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    await this.cacheManager.clear();
    return deletedProgram;
  }
}
