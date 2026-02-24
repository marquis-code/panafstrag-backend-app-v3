import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

const HomeContentSchema = new mongoose.Schema({
  aboutUsSubTitle: String,
  aboutUsTitle: String,
  objectivesSubTitle: String,
  objectivesTitle: String,
  responsibilitiesSubTitle: String,
  responsibilitiesTitle: String,
  programsTitle: String,
  ctaTitle: String,
  ctaDescription: String
}, { strict: false });

const HomeContentModel = mongoose.model('HomeContent', HomeContentSchema, 'homecontents');

async function seed() {
  await mongoose.connect(uri as string);
  console.log('Connected to Mongoose.');

  const updateDoc = {
    aboutUsSubTitle: "Who We Are",
    aboutUsTitle: "About <span class='not-italic text-gray-400'>PANAFSTRAG</span>",
    objectivesSubTitle: "Strategic Alignment",
    objectivesTitle: "Institutional <br class='md:hidden' /> <span class='not-italic text-gray-400'>Objectives</span>",
    responsibilitiesSubTitle: "Code of Conduct",
    responsibilitiesTitle: "Core <br class='md:hidden' /> <span class='not-italic text-gray-400'>Responsibilities</span>",
    programsTitle: "Recent <span class='not-italic text-gray-400'>Programs</span>",
    ctaTitle: "Participate in <br class='hidden md:block' /> <span class='not-italic text-[#2E7D32]'>the Future</span>",
    ctaDescription: "Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today."
  };

  const doc = await HomeContentModel.findOne({});
  if (doc) {
    await HomeContentModel.updateOne({ _id: doc._id }, { $set: updateDoc });
    console.log('Updated existing document.');
  } else {
    await HomeContentModel.create(updateDoc);
    console.log('Created new document.');
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
