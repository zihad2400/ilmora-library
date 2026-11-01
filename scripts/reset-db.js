import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🔌 Connected to MongoDB");

    // Book কালেকশন ডিলিট করা (পুরনো ইনডেক্সসহ)
    try {
      await mongoose.connection.db.dropCollection("books");
      console.log("🗑️ Dropped existing 'books' collection and its indexes.");
    } catch (e) {
      if (e.code === 26) console.log("ℹ️ 'books' collection does not exist yet.");
      else throw e;
    }

    // BookCopy কালেকশন ডিলিট করা
    try {
      await mongoose.connection.db.dropCollection("bookcopies");
      console.log("🗑️ Dropped existing 'bookcopies' collection.");
    } catch (e) {
      if (e.code === 26) console.log("ℹ️ 'bookcopies' collection does not exist yet.");
      else throw e;
    }

    console.log("✅ Database reset successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Reset Failed:", error.message);
  }
  process.exit(0);
}

run();
