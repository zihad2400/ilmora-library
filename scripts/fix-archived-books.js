import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // যেসব বইয়ে isArchived নেই বা false নেই, তাদের false করে দেওয়া
  const result = await Book.updateMany(
    { isArchived: { $ne: false } },
    { $set: { isArchived: false } }
  );

  console.log(`✅ Updated ${result.modifiedCount} books to isArchived: false`);
  
  // এখন মোট কতগুলো বই আছে তা চেক করা
  const totalBooks = await Book.countDocuments({ isArchived: false });
  console.log(`📚 Total books available now: ${totalBooks}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
