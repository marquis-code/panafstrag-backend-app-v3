/**
 * One-time migration script: Backfills `isArchived: true` on all existing
 * documents in the "archives" collection that don't already have the flag.
 *
 * Usage:  node scripts/backfill-is-archived.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/panafstrag';

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(); // uses the DB name from the URI
    const archives = db.collection('archives');

    // Update every document that is missing `isArchived`
    const result = await archives.updateMany(
      { isArchived: { $ne: true } },
      { $set: { isArchived: true } },
    );

    console.log(
      `🏷️  Backfill complete — ${result.modifiedCount} document(s) tagged with isArchived: true`,
    );
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

run();
