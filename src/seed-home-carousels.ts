import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();

    const carouselsData = [
      {
        title: "PANAFSTRAG Mission Statement",
        description: "Panafricana Stratetegic & Policy Research Group (PANAFSTRAG) is a group of willing Africana People coming together voluntarily to deliver original thinking through in-depth study, research, and analyses that benefit Africana people worldwide.",
        imgUrl: "/images/mission_statement_1771885779898.png",
      },
      {
        title: "Transparency",
        description: "Openness in the conduct of organization's affairs and observation of laid down procedures.",
        imgUrl: "/images/transparency_ethics_1771885801295.png",
      },
      {
        title: "Integrity",
        description: "PANAFSTRAG is responsive, responsible, professional, sensitive to the needs of others, tolerance and responsiveness to criticisms and pro-activity.",
        imgUrl: "/images/integrity_1771885838526.png",
      },
      {
        title: "Probity & Accountability",
        description: "PANAFSTRAG regard office, power and authority as a trust with the obligation to render services and give timely account of stewardship.",
        imgUrl: "/images/probity_accountability_1771885859814.png",
      },
      {
        title: "Social Justice",
        description: "PANAFSTRAG ensures fairness, equity and equal opportunity in apportioning responsibility and resources.",
        imgUrl: "/images/social_justice_1771885877862.png",
      },
      {
        title: "Human Dignity",
        description: "Respect for human life and the human person and promotion of access to meaningful existence.",
        imgUrl: "/images/human_dignity_1771885907570.png",
      }
    ];

    console.log('Seeding / Updating HomeContent carousels...');

    // We assume there's one primary HomeContent document, so we can just update the first one or use an updateMany just in case.
    const result = await db.collection('homecontents').updateMany(
      {},
      { $set: { carousels: carouselsData } }
    );

    console.log(`Update result: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
    
    // Fallback if none existed:
    if (result.matchedCount === 0) {
      console.log('No home content found to update. Seed manually via app or this script if needed.');
    }

    console.log('HomeContent carousel seeding complete!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.close();
  }
}

run();
