import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async saveMessage(data: { 
    sender?: string; 
    guestName?: string; 
    guestEmail?: string; 
    content: string;
    type?: string;
    imageUrl?: string;
    recipient?: string;
    recipientEmail?: string;
  }): Promise<MessageDocument> {
    const createdMessage = new this.messageModel(data);
    return createdMessage.save();
  }

  async findConversation(participantId?: string, participantEmail?: string): Promise<MessageDocument[]> {
    const query = participantId 
      ? { $or: [{ sender: participantId }, { recipient: participantId }] }
      : { $or: [{ guestEmail: participantEmail }, { recipientEmail: participantEmail }] };
      
    return this.messageModel
      .find(query)
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findAll(): Promise<MessageDocument[]> {
    return this.messageModel
      .find()
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .exec();
  }
}
