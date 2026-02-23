const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://panafstrag-db:panafstrag-db@panafstrag-db.omvz628.mongodb.net/?appName=panafstrag-db";

async function clearChat() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const result = await db.collection('messages').deleteMany({});
    console.log(`Cleared ${result.deletedCount} messages from the 'messages' collection.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing chat:', error);
    process.exit(1);
  }
}

clearChat();
