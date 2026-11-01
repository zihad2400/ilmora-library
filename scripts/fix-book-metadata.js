import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

const PUBLISHERS = [
  "Darussalam", "Islamic Foundation", "O'Reilly Media", "Pearson", 
  "Ador Prokash", "Ananya", "Tamralipi", "Sahitya Bhandar",
  "Prentice Hall", "Addison-Wesley", "Wiley", "No Starch Press"
];

const EDITIONS = ["1st", "2nd", "3rd", "4th", "5th", "Revised", "Deluxe", "Standard"];
const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  const books = await Book.find({});
  let updatedCount = 0;

  for (const book of books) {
    let needsUpdate = false;

    // যদি পাবলিশার না থাকে বা "Unknown Publisher" থাকে
    if (!book.publisher || book.publisher === "Unknown Publisher") {
      book.publisherName = PUBLISHERS[Math.floor(Math.random() * PUBLISHERS.length)];
      needsUpdate = true;
    }

    // যদি এডিশন ফাঁকা থাকে
    if (!book.edition || book.edition === "—" || book.edition === "") {
      book.edition = EDITIONS[Math.floor(Math.random() * EDITIONS.length)];
      needsUpdate = true;
    }

    // যদি বছর ফাঁকা থাকে
    if (!book.publicationYear) {
      book.publicationYear = YEARS[Math.floor(Math.random() * YEARS.length)];
      needsUpdate = true;
    }

    if (needsUpdate) {
      // যেহেতু Publisher একটি ObjectId, আমরা টেক্সট নামটি সরাসরি সেভ করতে পারি না।
      // তবে আপাতত ডাটাবেসে একটি ডামি পাবলিশার তৈরি করে সেটির আইডি বসিয়ে দিচ্ছি।
      const Publisher = mongoose.connection.collection("publishers");
      const pubName = book.publisherName || PUBLISHERS[Math.floor(Math.random() * PUBLISHERS.length)];
      
      let publisherDoc = await Publisher.findOne({ name: pubName });
      if (!publisherDoc) {
        const insertRes = await Publisher.insertOne({ name: pubName, createdAt: new Date(), updatedAt: new Date() });
        publisherDoc = { _id: insertRes.insertedId };
      }

      book.publisher = publisherDoc._id;
      delete book.publisherName;

      await book.save();
      updatedCount++;
    }
  }

  console.log(`✅ Successfully updated metadata for ${updatedCount} books.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
