import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeContent, HomeContentDocument } from './schemas/home-content.schema';
import { CreateHomeContentDto } from './dto/home-content.dto';

@Injectable()
export class HomeContentService {
  constructor(
    @InjectModel(HomeContent.name) private homeContentModel: Model<HomeContentDocument>,
  ) {}

  async getHomeContent(): Promise<HomeContent> {
    const content = await this.homeContentModel.findOne().exec();
    if (!content) {
      const seedData = {
        carousels: [
          {
            title: "PANAFSTRAG Mission Statement",
            description:
              "Pan-Africana Strategic and Policy Research Group (PANAFSTRAG) is a group of willing Africana People coming together voluntarily to deliver original thinking through in-depth study, research, and analyses that benefit Africana people worldwide.",
            imgUrl: "hero.jpeg",
          },
          {
            title: "Transparency",
            description:
              "Openness in the conduct of organization's affairs and observation of laid down procedures.",
            imgUrl: "hero2.jpeg",
          },
          {
            title: "Integrity",
            description:
              "PANAFSTRAG is responsive, responsible, professional, sensitive to the needs of others, tolerance and responsiveness to criticisms and pro-activity.",
            imgUrl: "hero2.jpeg",
          },
          {
            title: "Probity & Accountability",
            description:
              "PANAFSTRAG regard office, power and authority as a trust with the obligation to render services and give timely account of stewardship.",
            imgUrl: "hero.jpeg",
          },
          {
            title: "Social Justice",
            description:
              "PANAFSTRAG ensures fairness, equity and equal opportunity in apportioning responsibility and resources.",
            imgUrl: "hero2.jpeg",
          },
          {
            title: "Human Dignity",
            description:
              "Respect for human life and the human person and promotion of access to meaningful existence.",
            imgUrl: "hero.jpeg",
          },
        ],
        aboutUsTitle: 'About PANAFSTRAG',
        aboutUsDescription: 'Pan-Africana Strategic and Policy Research Group was founded in 1992...'
      };
      return await new this.homeContentModel(seedData).save();
    }
    return content;
  }

  async updateHomeContent(updateDto: CreateHomeContentDto): Promise<HomeContent> {
    let content = await this.homeContentModel.findOne().exec();
    if (!content) {
      content = new this.homeContentModel(updateDto);
      return await content.save();
    }
    return (await this.homeContentModel.findByIdAndUpdate(content._id, updateDto, { new: true }).exec()) as HomeContent;
  }
}
