import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<EnquiryDocument> {
    const createdEnquiry = new this.enquiryModel(createEnquiryDto);
    return createdEnquiry.save();
  }

  async findAll(): Promise<EnquiryDocument[]> {
    return this.enquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<EnquiryDocument | null> {
    return this.enquiryModel.findById(id).exec();
  }

  async updateStatus(id: string, status: string): Promise<EnquiryDocument | null> {
    return this.enquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async remove(id: string): Promise<EnquiryDocument | null> {
    return this.enquiryModel.findByIdAndDelete(id).exec();
  }
}
