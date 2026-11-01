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
  const catMap = {};
  categories.forEach(c => catMap[c.name] = c._id);

  // ২. সব বই নিয়ে চেক করা
  const books = await Book.find({});
  let updatedCount = 0;

  for (const book of books) {
    let needsUpdate = false;
    
    // যদি বইয়ের category আইডি না থাকে বা ভুল থাকে
    if (!book.category) {
      // বইয়ের টাইটেল দেখে অনুমান করা
      let catName = "Islamic Education"; 
      const t = book.title.toLowerCase();
      
      if (t.includes("কুরআন") || t.includes("তাফসীর") || t.includes("quran") || t.includes("tafsir")) catName = "Quran & Tafsir";
      else if (t.includes("হাদীস") || t.includes("হাদিস") || t.includes("bukhari") || t.includes("muslim") || t.includes("hadith") || t.includes("রিয়াদুস")) catName = "Hadith";
      else if (t.includes("সীরাত") || t.includes("ইতিহাস") || t.includes("history") || t.includes("রাহীকুল")) catName = "Islamic History";
      else if (t.includes("আকীদা") || t.includes("তাওহীদ") || t.includes("aqeedah")) catName = "Islamic Education";
      else if (t.includes("ফিকহ") || t.includes("ফতোয়া") || t.includes("fiqh") || t.includes("নামাজ")) catName = "Islamic Education";
      else if (t.includes("javascript") || t.includes("python") || t.includes("c++") || t.includes("java") || t.includes("programming")) catName = "Programming";
      else if (t.includes("code") || t.includes("software") || t.includes("algorithms")) catName = "Software Engineering";
      else if (t.includes("html") || t.includes("css") || t.includes("web")) catName = "Web Development";

      const correctCatId = catMap[catName] || catMap["Islamic Education"];
      if (correctCatId) {
        book.category = correctCatId;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await book.save();
      updatedCount++;
    }
  }

  console.log(`✅ Fixed categories for ${updatedCount} books.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
