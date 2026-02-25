import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Program, ProgramDocument } from './schemas/program.schema';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramService {
  private readonly CACHE_KEY = 'programs_all';

  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<ProgramDocument> {
    const createdProgram = new this.programModel(createProgramDto);
    const saved = await createdProgram.save();
    await this.cacheManager.clear();
    return saved;
  }

  async findAll(query?: { type?: string; year?: number; month?: number }): Promise<ProgramDocument[]> {
    const cacheKey = `${this.CACHE_KEY}_${JSON.stringify(query || {})}`;
    const cachedPrograms = await this.cacheManager.get<ProgramDocument[]>(cacheKey);
    if (cachedPrograms) {
      return cachedPrograms;
    }

    const filter: any = {};
    if (query?.type && query.type !== 'all') filter.type = query.type;
    if (query?.year) filter.year = Number(query.year);
    if (query?.month) filter.month = Number(query.month);

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
