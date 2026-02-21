import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async saveMessage(data: { sender: string; content: string }): Promise<MessageDocument> {
    const createdMessage = new this.messageModel(data);
    return createdMessage.save();
  }

  async findAll(): Promise<MessageDocument[]> {
    return this.messageModel.find().populate('sender', 'name email').sort({ createdAt: 1 }).exec();
  }
}
