import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { BotConfig, BotConfigDocument } from './schemas/bot-config.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(BotConfig.name) private botConfigModel: Model<BotConfigDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  // ========== Messages ==========
  async saveMessage(data: { 
    sender?: string; guestName?: string; guestEmail?: string; 
    content: string; type?: string; imageUrl?: string;
    recipient?: string; recipientEmail?: string;
    conversationId?: string; isAdmin?: boolean; isBot?: boolean;
  }): Promise<MessageDocument> {
    console.log('[ChatService] 💾 Saving message. isAdmin:', !!data.isAdmin, 'isBot:', !!data.isBot);
    const createdMessage = new this.messageModel(data);
    const saved = await createdMessage.save();
    console.log('[ChatService] ✅ Saved ID:', saved._id);
    return this.messageModel.findById(saved._id).populate('sender', 'name email').exec() as Promise<MessageDocument>;
  }

  async findConversationById(conversationId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findAll(): Promise<MessageDocument[]> {
    const messages = await this.messageModel
      .find()
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .exec();
    console.log(`[ChatService] 📑 Found ${messages.length} total messages in database`);
    return messages;
  }

  async clearAll(): Promise<void> {
    await this.messageModel.deleteMany({}).exec();
  }

  // ========== Bot Config ==========
  async createBotConfig(data: Partial<BotConfig>): Promise<BotConfigDocument> {
    const config = new this.botConfigModel(data);
    return config.save();
  }

  async updateBotConfig(id: string, data: Partial<BotConfig>): Promise<BotConfigDocument | null> {
    return this.botConfigModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteBotConfig(id: string): Promise<void> {
    await this.botConfigModel.findByIdAndDelete(id).exec();
  }

  async findAllBotConfigs(): Promise<BotConfigDocument[]> {
    return this.botConfigModel.find().sort({ priority: -1, type: 1 }).exec();
  }

  async findActiveBotConfigs(): Promise<BotConfigDocument[]> {
    return this.botConfigModel.find({ isActive: true }).sort({ priority: -1 }).exec();
  }

  async seedDefaultBotConfigs(): Promise<void> {
    const count = await this.botConfigModel.countDocuments().exec();
    if (count > 0) return; // Already seeded

    const defaults: Partial<BotConfig>[] = [
      {
        key: 'welcome',
        type: 'greeting',
        message: 'Welcome to PANAFSTRAG! 👋 Great to have you here. How may I help you today?',
        quickReplies: ['Tell me about PANAFSTRAG', 'How do I become a member?', 'I want to request a publication', 'What programs do you offer?', 'How can I contact you?'],
        delayMs: 5000,
        priority: 100,
        isActive: true,
      },
      {
        key: 'page_programs',
        type: 'page_trigger',
        message: "I see you're browsing our Programs! 🎯 Would you like to know more about any specific program or how to get involved?",
        pagePath: '/programs',
        quickReplies: ['Tell me about available programs', 'How do I apply?'],
        delayMs: 2000,
        priority: 50,
        isActive: true,
      },
      {
        key: 'page_archives',
        type: 'page_trigger',
        message: "Looking through our archives? 📚 I can help you find specific publications or research documents.",
        pagePath: '/archives',
        quickReplies: ['Show me recent publications', 'How do I submit a paper?'],
        delayMs: 2000,
        priority: 50,
        isActive: true,
      },
      {
        key: 'page_about',
        type: 'page_trigger',
        message: "Want to know more about PANAFSTRAG? 🌍 Feel free to ask me anything!",
        pagePath: '/about',
        quickReplies: ['What is PANAFSTRAG?', 'How can I get involved?'],
        delayMs: 2000,
        priority: 50,
        isActive: true,
      },
      {
        key: 'page_contact',
        type: 'page_trigger',
        message: "Need to get in touch? 📞 I can help you right away or connect you with our team.",
        pagePath: '/contact',
        quickReplies: ['Give me the contact info', 'I want to speak with someone'],
        delayMs: 2000,
        priority: 50,
        isActive: true,
      },
      {
        key: 'faq_about',
        type: 'faq',
        message: 'PANAFSTRAG is the Pan-African Strategic Group dedicated to institutional collaboration, research publications, and strategic growth across Africa.',
        keywords: ['about', 'panafstrag', 'what is', 'who are', 'tell me'],
        priority: 30,
        isActive: true,
      },
      {
        key: 'faq_membership',
        type: 'faq',
        message: 'We offer individual and institutional memberships. You can apply through our website or contact us directly for more information on membership tiers and benefits.',
        keywords: ['member', 'join', 'signup', 'sign up', 'register'],
        priority: 30,
        isActive: true,
      },
      {
        key: 'faq_publication',
        type: 'faq',
        message: 'To request a publication or submit a paper, please share your details and we will have our publications team reach out to you within 24 hours.',
        keywords: ['publication', 'publish', 'paper', 'submit', 'journal'],
        priority: 30,
        isActive: true,
      },
      {
        key: 'faq_contact',
        type: 'faq',
        message: 'You can reach us via email at info@panafstrag.org or call us at +234-800-000-0000. We are available Monday to Friday, 9 AM - 5 PM WAT.',
        keywords: ['contact', 'reach', 'email', 'phone', 'call', 'address'],
        priority: 30,
        isActive: true,
      },
      {
        key: 'faq_programs',
        type: 'faq',
        message: 'We run various programs across Africa focusing on capacity building, institutional development, and strategic partnerships. Visit our Programs page to learn more.',
        keywords: ['program', 'course', 'training', 'capacity', 'workshop'],
        priority: 30,
        isActive: true,
      },
      {
        key: 'faq_help',
        type: 'faq',
        message: "I can help you with information about PANAFSTRAG, membership enquiries, publication requests, our programs, and more. Just ask! 😊",
        keywords: ['help', 'hi', 'hello', 'hey', 'good morning', 'good afternoon'],
        priority: 10,
        isActive: true,
      },
      {
        key: 'fallback',
        type: 'fallback',
        message: "Thanks for your message! Our team will respond shortly. In the meantime, feel free to ask me anything about PANAFSTRAG. 💬",
        quickReplies: ['Tell me about PANAFSTRAG', 'How do I become a member?', 'How can I contact you?'],
        priority: 0,
        isActive: true,
      },
    ];

    await this.botConfigModel.insertMany(defaults);
    console.log('[ChatService] 🤖 Seeded', defaults.length, 'default bot configs');
  }

  // ========== Activity Tracking ==========
  async logActivity(data: Partial<Activity>): Promise<ActivityDocument> {
    const activity = new this.activityModel(data);
    return activity.save();
  }

  async findActivities(filters?: {
    sessionId?: string;
    event?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ activities: ActivityDocument[]; total: number }> {
    const query: any = {};
    if (filters?.sessionId) query.sessionId = filters.sessionId;
    if (filters?.event) query.event = filters.event;
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.activityModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.activityModel.countDocuments(query).exec(),
    ]);

    return { activities, total };
  }

  async getActivityStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalVisitors, todayVisitors, totalPageViews, topPages, recentSessions] = await Promise.all([
      this.activityModel.distinct('sessionId').exec().then(ids => ids.length),
      this.activityModel.distinct('sessionId', { createdAt: { $gte: today } }).exec().then(ids => ids.length),
      this.activityModel.countDocuments({ event: 'page_visit' }).exec(),
      this.activityModel.aggregate([
        { $match: { event: 'page_visit' } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).exec(),
      this.activityModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: {
          _id: '$sessionId',
          guestName: { $first: '$guestName' },
          guestEmail: { $first: '$guestEmail' },
          lastActivity: { $first: '$createdAt' },
          firstActivity: { $last: '$createdAt' },
          events: { $sum: 1 },
          pages: { $addToSet: '$page' },
        }},
        { $sort: { lastActivity: -1 } },
        { $limit: 20 },
      ]).exec(),
    ]);

    return {
      totalVisitors,
      todayVisitors,
      totalPageViews,
      topPages,
      recentSessions,
    };
  }
}
