import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Responsibility, ResponsibilityDocument } from './schemas/responsibility.schema';
import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';

@Injectable()
export class ResponsibilityService {
  constructor(
    @InjectModel(Responsibility.name) private responsibilityModel: Model<ResponsibilityDocument>,
  ) {}

  async create(createResponsibilityDto: CreateResponsibilityDto): Promise<ResponsibilityDocument> {
    const createdResponsibility = new this.responsibilityModel(createResponsibilityDto);
    return createdResponsibility.save();
  }

  async findAll(): Promise<ResponsibilityDocument[]> {
    return this.responsibilityModel.find().exec();
  }

  async findOne(id: string): Promise<ResponsibilityDocument> {
    const responsibility = await this.responsibilityModel.findById(id).exec();
    if (!responsibility) {
      throw new NotFoundException(`Responsibility with ID ${id} not found`);
    }
    return responsibility;
  }

  async update(id: string, updateResponsibilityDto: UpdateResponsibilityDto): Promise<ResponsibilityDocument> {
    const updatedResponsibility = await this.responsibilityModel
      .findByIdAndUpdate(id, updateResponsibilityDto, { new: true })
      .exec();
    if (!updatedResponsibility) {
      throw new NotFoundException(`Responsibility with ID ${id} not found`);
    }
    return updatedResponsibility;
  }

  async remove(id: string): Promise<ResponsibilityDocument> {
    const deletedResponsibility = await this.responsibilityModel.findByIdAndDelete(id).exec();
    if (!deletedResponsibility) {
      throw new NotFoundException(`Responsibility with ID ${id} not found`);
    }
    return deletedResponsibility;
  }
}
