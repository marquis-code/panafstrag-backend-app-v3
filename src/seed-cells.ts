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

    const cells = [
      {
        name: 'Cell 1',
        description: 'Economy (including Cultural & Creative) Trade, Business and Finances',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cell 2',
        description: 'Soft Power Diplomacy, Africana Public Institutions Representation and Liaisons. All Media, ETC and Awareness Campaign: “I am an Africana” Establishing PANAFSTRAG TV/RADIO by 2024',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cell 3',
        description: 'Our Story, Africana Indigenous Knowledge Systems, Philosophy, Technology Culture and Arts.',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cell 4',
        description: 'Development, Education and Health',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cell 5',
        description: 'Digital Transformation and Cyber-security-4IR, Public, Private and CSOs',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cell 6',
        description: 'Legal',
        location: '',
        leadName: '',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    console.log('Seeding Cells...');
    await db.collection('cells').deleteMany({});
    await db.collection('cells').insertMany(cells);

    console.log('Cell seeding complete!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.close();
  }
}

run();
