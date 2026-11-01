import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Author from "../src/models/Author.js";
import Publisher from "../src/models/Publisher.js";
import Book from "../src/models/Book.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

const REAL_BOOKS = [
  {
    title: "তাফসীর ইবনে কাসীর",
    authorName: "ইবনে কাসীর",
    category: "Quran & Tafsir",
    description: "পবিত্র কুরআনের বিখ্যাত তাফসীর গ্রন্থ।",
    language: "Bangla"
  },
  {
    title: "রিয়াদুস সালিহীন",
    authorName: "ইমাম নববী",
    category: "Hadith",
    description: "হাদিস সংকলনের একটি প্রসিদ্ধ গ্রন্থ।",
    language: "Bangla"
  },
  {
    title: "সহীহ মুসলিম",
    authorName: "ইমাম মুসলিম",
    category: "Hadith",
    description: "সিহাহ সিত্তাহর অন্যতম কিতাব।",
    language: "Bangla"
  },
  {
    title: "৮০ হাদীস",
    authorName: "ড. মুহাম্মদ হকিম",
    category: "Hadith",
    description: "জীবন ঘনিষ্ঠ ৮০ টি হাদিসের সংকলন।",
    language: "Bangla"
  },
  {
    title: "রমজান মাসের ৩০ আসর",
    authorName: "শায়খ সালেহ আল-উসাইমীন",
    category: "Islamic Education",
    description: "রমজান মাসের প্রতিদিনের আমল ও দোয়া।",
    language: "Bangla"
  },
  {
    title: "বিবাহ পূর্ব প্রস্তুতি",
    authorName: "তানযিল আরেফিন আদনান",
    category: "Islamic Literature",
    description: "বিবাহের পূর্বে প্রয়োজনীয় ইসলামিক জ্ঞান।",
    language: "Bangla"
  },
  {
    title: "আকাবির পাড়ায়",
    authorName: "মাহমুদা খাতুন",
    category: "Islamic Literature",
    description: "বিখ্যাত ইসলামিক উপন্যাস।",
    language: "Bangla"
  },
  {
    title: "বিবাহ, পরিবার ও সন্তান প্রতিপালন",
    authorName: "মুহাম্মদ আসাদুল্লাহ আল-গালিব",
    category: "Islamic Education",
    description: "পারিবারিক জীবনব্যবস্থার ইসলামিক দিকনির্দেশনা।",
    language: "Bangla"
  },
  {
    title: "আর-রাহীকুল মাখতূম",
    authorName: "সফিউর রহমান মোবারকপুরী",
    category: "Islamic History",
    description: "মহানবী (সা.) এর জীবনীগ্রন্থ।",
    language: "Bangla"
  },
  {
    title: "আল-আদাবুল মুফরাদ",
    authorName: "ইমাম বুখারী",
    category: "Hadith",
    description: "আদব-আখলাক বিষয়ক হাদিস গ্রন্থ।",
    language: "Bangla"
  },
  {
    title: "সীরাতে খাতামুন নাবিয়্যীন",
    authorName: "আল্লামা শিবলী নোমানী",
    category: "Islamic History",
    description: "মহানবী (সা.) এর জীবনী।",
    language: "Bangla"
  },
  {
    title: "বেহেশতী জেওর",
    authorName: "মাওলানা আশরাফ আলী থানভী",
    category: "Islamic Education",
    description: "পরিবার ও সমাজ জীবনের ইসলামিক বিধান।",
    language: "Bangla"
  },
  {
    title: "The Pragmatic Programmer",
    authorName: "Andrew Hunt",
    category: "Software Engineering",
    description: "কোডিং ও সফটওয়্যার ডেভেলপমেন্টের বাস্তব নির্দেশিকা।",
    language: "English"
  },
  {
    title: "Clean Architecture",
    authorName: "Robert C. Martin",
    category: "Software Engineering",
    description: "সফটওয়্যার আর্কিটেকচার ডিজাইন করার সেরা গাইড।",
    language: "English"
  },
  {
    title: "JavaScript: The Good Parts",
    authorName: "Douglas Crockford",
    category: "Programming",
    description: "জাভাস্ক্রিপ্টের সেরা দিকগুলো নিয়ে আলোচনা।",
    language: "English"
  },
  {
    title: "HTML & CSS: Design and Build Websites",
    authorName: "Jon Duckett",
    category: "Web Development",
    description: "ওয়েব ডিজাইনের বেসিক থেকে অ্যাডভান্স গাইড।",
    language: "English"
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ১. ক্যাটাগরি, অথর, পাবলিশার ম্যাপ তৈরি
  const categories = await Category.find({});
  const catMap = {};
  categories.forEach(c => catMap[c.name] = c._id);

  const defaultPublisher = await Publisher.findOne({}) || await Publisher.create({ name: "Unknown Publisher" });
  const defaultCategory = categories[0]?._id;

  let addedCount = 0;

  for (const b of REAL_BOOKS) {
    // ডুপ্লিকেট চেক
    const exists = await Book.findOne({ title: b.title });
    if (exists) {
      console.log(`⏭  Skipping (already exists): ${b.title}`);
      continue;
    }

    // অথর তৈরি বা খুঁজে বের করা
    let author = await Author.findOne({ name: b.authorName });
    if (!author) {
      author = await Author.create({ name: b.authorName });
    }

    // বই তৈরি
    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`; // ডামি ইউনিক ISBN
    const book = await Book.create({
      title: b.title,
      authors: [author._id],
      publisher: defaultPublisher._id,
      category: catMap[b.category] || defaultCategory,
      isbn: isbn,
      language: b.language,
      description: b.description,
      shelfLocation: `GEN-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1
    });

    // ফিজিক্যাল কপি তৈরি
    await BookCopy.create({
      book: book._id,
      copyId: `${isbn.replace(/[^0-9]/g, "").slice(-6)}-C01`,
      status: "AVAILABLE",
      condition: "GOOD",
      shelfLocation: book.shelfLocation
    });

    addedCount++;
    console.log(`✅ Added: ${b.title} (${b.authorName})`);
  }

  console.log(`🎉 Done! Added ${addedCount} real books from your library photos.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
