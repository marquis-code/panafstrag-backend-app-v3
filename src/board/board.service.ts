import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Board, BoardDocument } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  private readonly CACHE_KEY = 'board_all';

  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardDocument> {
    const createdBoard = new this.boardModel(createBoardDto);
    const saved = await createdBoard.save();
    await this.cacheManager.del(this.CACHE_KEY);
    return saved;
  }

  async findAll(): Promise<BoardDocument[]> {
    const cachedData = await this.cacheManager.get<BoardDocument[]>(this.CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.boardModel.find().exec();
    await this.cacheManager.set(this.CACHE_KEY, data);
    return data;
  }

  async findOne(id: string): Promise<BoardDocument> {
    const board = await this.boardModel.findById(id).exec();
    if (!board) {
      throw new NotFoundException(`Board member with ID ${id} not found`);
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(id, updateBoardDto, { new: true })
      .exec();
    if (!updatedBoard) {
      throw new NotFoundException(`Board member with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return updatedBoard;
  }

  async remove(id: string): Promise<BoardDocument> {
    const deletedBoard = await this.boardModel.findByIdAndDelete(id).exec();
    if (!deletedBoard) {
      throw new NotFoundException(`Board member with ID ${id} not found`);
    }
    await this.cacheManager.del(this.CACHE_KEY);
    return deletedBoard;
  }
}
