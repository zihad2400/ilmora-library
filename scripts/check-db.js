import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🔌 Connected to MongoDB");
    
    const db = mongoose.connection.db;
    const booksCount = await db.collection("books").countDocuments();
    const categoriesCount = await db.collection("categories").countDocuments();
    
    console.log(`\n📚 Total Books in DB: ${booksCount}`);
    console.log(`📁 Total Categories in DB: ${categoriesCount}`);
    
    if (booksCount > 0) {
      const sampleBooks = await db.collection("books").find({}).limit(3).toArray();
      console.log("\n📖 Sample Books (First 3):");
      sampleBooks.forEach(b => {
        console.log(`- Title: "${b.title}", Category ID: ${b.category || 'NULL'}, isArchived: ${b.isArchived}`);
      });
    } else {
      console.log("\n❌ No books found in the database! The seed script did not run correctly.");
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
  }
  process.exit(0);
}

run();
