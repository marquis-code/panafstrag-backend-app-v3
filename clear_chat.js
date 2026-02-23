const mongoose = require('mongoose');

const uri = "mongodb+srv://panafstrag-db:panafstrag-db@panafstrag-db.omvz628.mongodb.net/?appName=panafstrag-db";

async function clearDb() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    const result = await mongoose.connection.collection('messages').deleteMany({});
    console.log(`Deleted ${result.deletedCount} messages.`);
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

clearDb();
