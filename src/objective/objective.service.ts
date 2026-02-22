import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Objective, ObjectiveDocument } from './schemas/objective.schema';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectiveService {
  constructor(
    @InjectModel(Objective.name) private objectiveModel: Model<ObjectiveDocument>,
  ) {}

  async create(createObjectiveDto: CreateObjectiveDto): Promise<ObjectiveDocument> {
    const createdObjective = new this.objectiveModel(createObjectiveDto);
    return createdObjective.save();
  }

  async findAll(): Promise<ObjectiveDocument[]> {
    return this.objectiveModel.find().exec();
  }

  async findOne(id: string): Promise<ObjectiveDocument> {
    const objective = await this.objectiveModel.findById(id).exec();
    if (!objective) {
      throw new NotFoundException(`Objective with ID ${id} not found`);
    }
    return objective;
  }

  async update(id: string, updateObjectiveDto: UpdateObjectiveDto): Promise<ObjectiveDocument> {
    const updatedObjective = await this.objectiveModel
      .findByIdAndUpdate(id, updateObjectiveDto, { new: true })
      .exec();
    if (!updatedObjective) {
      throw new NotFoundException(`Objective with ID ${id} not found`);
    }
    return updatedObjective;
  }

  async remove(id: string): Promise<ObjectiveDocument> {
    const deletedObjective = await this.objectiveModel.findByIdAndDelete(id).exec();
    if (!deletedObjective) {
      throw new NotFoundException(`Objective with ID ${id} not found`);
    }
    return deletedObjective;
  }
}
