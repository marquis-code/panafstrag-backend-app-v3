import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeContentDocument = HomeContent & Document;

@Schema({ _id: false })
class CarouselItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imgUrl: string;
}

const CarouselItemSchema = SchemaFactory.createForClass(CarouselItem);

@Schema({ _id: false })
class NavItem {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  path: string;
}

@Schema({ _id: false })
class SocialLink {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}

const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

const NavItemSchema = SchemaFactory.createForClass(NavItem);

@Schema({ timestamps: true })
export class HomeContent {
  @Prop({ type: [CarouselItemSchema], default: [] })
  carousels: CarouselItem[];

  @Prop({ required: true })
  aboutUsDescription: string;

  @Prop({ required: true })
  aboutUsTitle: string;

  @Prop({ required: false })
  aboutUsContextImage?: string;

  @Prop({ required: false })
  aboutUsContextText?: string;

  @Prop({ required: false })
  languageGroupFunction?: string;

  @Prop({ required: false })
  languageGroupMembership?: string;

  @Prop({ required: false })
  languageGroupLeadership?: string;

  @Prop({ required: false })
  languageGroupFees?: string;

  @Prop({ required: false })
  websiteHeaderText?: string;

  @Prop({ required: false })
  aboutUsSubTitle?: string;

  @Prop({ required: false })
  objectivesTitle?: string;

  @Prop({ required: false })
  objectivesSubTitle?: string;

  @Prop({ required: false })
  responsibilitiesTitle?: string;

  @Prop({ required: false })
  responsibilitiesSubTitle?: string;

  @Prop({ required: false })
  programsTitle?: string;

  @Prop({ required: false })
  ctaTitle?: string;

  @Prop({ required: false })
  ctaDescription?: string;

  @Prop({ required: false })
  programsSubTitle?: string;

  @Prop({ required: false })
  languageGroupFunctionTitle?: string;

  @Prop({ required: false })
  languageGroupMembershipTitle?: string;

  @Prop({ required: false })
  languageGroupLeadershipTitle?: string;

  @Prop({ required: false })
  languageGroupFeesTitle?: string;

  @Prop({ required: false })
  featuresTitle?: string;

  @Prop({ required: false })
  featuresSubTitle?: string;

  @Prop({ required: false })
  focusAreasPageTitle?: string;

  @Prop({ required: false })
  focusAreasPageDescription?: string;

  @Prop({ required: false })
  programsPageTitle?: string;

  @Prop({ required: false })
  programsPageDescription?: string;

  @Prop({ required: false })
  archivesPageTitle?: string;

  @Prop({ required: false })
  archivesPageDescription?: string;

  @Prop({ required: false })
  boardPageTitle?: string;

  @Prop({ required: false })
  boardPageDescription?: string;

  @Prop({ required: false })
  organogramPageTitle?: string;

  @Prop({ required: false })
  organogramPageDescription?: string;

  @Prop({ required: false })
  cellsPageTitle?: string;

  @Prop({ required: false })
  cellsPageDescription?: string;

  @Prop({ required: false })
  contactPageTitle?: string;

  @Prop({ required: false })
  contactPageDescription?: string;

  @Prop({ required: false })
  languageGroupsPageTitle?: string;

  @Prop({ required: false })
  languageGroupsPageDescription?: string;

  @Prop({ type: [String], default: [] })
  contactEmail?: string[];

  @Prop({ type: [String], default: [] })
  contactPhone?: string[];

  @Prop({ required: false })
  contactAddress?: string;

  @Prop({ required: false })
  contactOfficeHoursMonFri?: string;

  @Prop({ required: false })
  contactOfficeHoursSat?: string;

  @Prop({ required: false })
  contactOfficeHoursSun?: string;

  @Prop({ type: [SocialLinkSchema], default: [] })
  contactSocialLinks: SocialLink[];

  @Prop({ type: [NavItemSchema], default: [] })
  primaryNavItems: NavItem[];

  @Prop({ type: [NavItemSchema], default: [] })
  instituteNavItems: NavItem[];

  @Prop({ required: false })
  heroEstablishedText?: string;
}

export const HomeContentSchema = SchemaFactory.createForClass(HomeContent);
