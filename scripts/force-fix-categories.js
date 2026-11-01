import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";
import Category from "../src/models/Category.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ১. সব ক্যাটাগরি খুঁজে বের করা
  const categories = await Category.find({});
  console.log("Categories in DB:", categories.map(c => c.name).join(", "));

  const catMap = {};
  categories.forEach(c => catMap[c.name] = c._id);

  // ২. সব বই নিয়ে চেক করা
  const books = await Book.find({});
  console.log(`\nTotal Books found: ${books.length}`);
  
  let updatedCount = 0;

  for (const book of books) {
    let catName = "Islamic Education"; // ডিফল্ট
    const t = book.title.toLowerCase();
    
    // বইয়ের নাম দেখে ক্যাটাগরি অনুমান
    if (t.includes("কুরআন") || t.includes("তাফসীর") || t.includes("quran") || t.includes("tafsir") || t.includes("তাফসীর")) catName = "Quran & Tafsir";
    else if (t.includes("হাদীস") || t.includes("হাদিস") || t.includes("bukhari") || t.includes("muslim") || t.includes("hadith") || t.includes("রিয়াদুস")) catName = "Hadith";
    else if (t.includes("সীরাত") || t.includes("ইতিহাস") || t.includes("history") || t.includes("রাহীকুল")) catName = "Islamic History";
    else if (t.includes("আকীদা") || t.includes("তাওহীদ") || t.includes("aqeedah") || t.includes("শির্ক")) catName = "Islamic Education";
    else if (t.includes("ফিকহ") || t.includes("ফতোয়া") || t.includes("fiqh") || t.includes("নামাজ")) catName = "Islamic Education";
    else if (t.includes("javascript") || t.includes("python") || t.includes("c++") || t.includes("java") || t.includes("programming") || t.includes("js")) catName = "Programming";
    else if (t.includes("code") || t.includes("software") || t.includes("algorithms") || t.includes("architecture")) catName = "Software Engineering";
    else if (t.includes("html") || t.includes("css") || t.includes("web")) catName = "Web Development";
    else if (t.includes("database") || t.includes("sql") || t.includes("mongodb")) catName = "Database Management";

    let correctCatId = catMap[catName];

    // যদি উক্ত ক্যাটাগরি ডাটাবেসে না থাকে, তবে নতুন তৈরি করা
    if (!correctCatId) {
      const newCat = await Category.create({ 
        name: catName, 
        slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      });
      correctCatId = newCat._id;
      catMap[catName] = correctCatId;
    }

    // যদি বইয়ের ক্যাটাগরি সঠিক না থাকে, তবে আপডেট করা
    if (!book.category || book.category.toString() !== correctCatId.toString()) {
      book.category = correctCatId;
      await book.save();
      updatedCount++;
    }
  }

  console.log(`\n✅ Successfully fixed categories for ${updatedCount} books.`);
  
  // ক্যাটাগরি অনুযায়ী কতগুলো বই আছে তা প্রিন্ট করা
  const finalCounts = await Book.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  console.log("\nFinal Book Counts by Category ID:");
  for (const f of finalCounts) {
    const cat = await Category.findById(f._id);
    console.log(`- ${cat ? cat.name : 'Unknown'}: ${f.count} books`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
