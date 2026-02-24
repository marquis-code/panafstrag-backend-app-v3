const { MongoClient } = require('mongodb');

async function seedHomeContentHeaders() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://panafstrag_db_user:UqYm3W322QfF1q1h@cluster0.pbgso.mongodb.net/panafstrag?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("panafstrag");
    const collection = database.collection("homecontents");

    const updateDoc = {
      $set: {
        aboutUsSubTitle: "Who We Are",
        aboutUsTitle: "About <span class='not-italic text-gray-400'>PANAFSTRAG</span>",
        objectivesSubTitle: "Strategic Alignment",
        objectivesTitle: "Institutional <br class='md:hidden' /> <span class='not-italic text-gray-400'>Objectives</span>",
        responsibilitiesSubTitle: "Code of Conduct",
        responsibilitiesTitle: "Core <br class='md:hidden' /> <span class='not-italic text-gray-400'>Responsibilities</span>",
        programsTitle: "Recent <span class='not-italic text-gray-400'>Programs</span>",
        ctaTitle: "Participate in <br class='hidden md:block' /> <span class='not-italic text-[#2E7D32]'>the Future</span>",
        ctaDescription: "Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today."
      }
    };

    const { ObjectId } = require('mongodb');
    const result = await collection.updateOne(
      { _id: new ObjectId("699c84e2adf186711e177783") }, 
      updateDoc, 
      { upsert: true }
    );
    console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);

  } finally {
    await client.close();
  }
}

seedHomeContentHeaders().catch(console.dir);
