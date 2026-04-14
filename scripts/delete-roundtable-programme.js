/**
 * Finds and deletes the "Virtual Roundtable on Boosting Intra-African Trade"
 * programme from both `programs` and `archives` collections.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/panafstrag';

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();

    // Search term from the image
    const searchRegex = /virtual roundtable.*intra.african/i;

    // --- Check programs collection ---
    const programs = db.collection('programs');
    const foundPrograms = await programs.find({ title: { $regex: searchRegex } }).toArray();

    if (foundPrograms.length > 0) {
      console.log(`🔍 Found ${foundPrograms.length} match(es) in "programs" collection:`);
      foundPrograms.forEach((p) => {
        console.log(`   📌 ID: ${p._id}`);
        console.log(`      Title: ${p.title}`);
        console.log(`      Date: ${p.date || p.startDate || 'N/A'}`);
        console.log(`      Status: ${p.status || 'N/A'}`);
        console.log(`      Type: ${p.type || 'N/A'}`);
        console.log('');
      });

      const delResult = await programs.deleteMany({ title: { $regex: searchRegex } });
      console.log(`🗑️  Deleted ${delResult.deletedCount} document(s) from "programs"\n`);
    } else {
      console.log('ℹ️  No matches in "programs" collection\n');
    }

    // --- Check archives collection ---
    const archives = db.collection('archives');
    const foundArchives = await archives.find({ title: { $regex: searchRegex } }).toArray();

    if (foundArchives.length > 0) {
      console.log(`🔍 Found ${foundArchives.length} match(es) in "archives" collection:`);
      foundArchives.forEach((a) => {
        console.log(`   📌 ID: ${a._id}`);
        console.log(`      Title: ${a.title}`);
        console.log(`      Date: ${a.date || a.startDate || 'N/A'}`);
        console.log(`      Type: ${a.type || 'N/A'}`);
        console.log('');
      });

      const delResult = await archives.deleteMany({ title: { $regex: searchRegex } });
      console.log(`🗑️  Deleted ${delResult.deletedCount} document(s) from "archives"\n`);
    } else {
      console.log('ℹ️  No matches in "archives" collection\n');
    }

    if (foundPrograms.length === 0 && foundArchives.length === 0) {
      console.log('⚠️  Programme not found in either collection. Trying broader search...\n');
      
      // Broader fallback search
      const broadRegex = /roundtable.*trade/i;
      const broadPrograms = await programs.find({ title: { $regex: broadRegex } }).toArray();
      const broadArchives = await archives.find({ title: { $regex: broadRegex } }).toArray();
      
      console.log(`   Broad search found ${broadPrograms.length} in programs, ${broadArchives.length} in archives`);
      [...broadPrograms, ...broadArchives].forEach((doc) => {
        console.log(`   📌 ID: ${doc._id} | Title: ${doc.title}`);
      });
    }

    console.log('✅ Done.');
  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
