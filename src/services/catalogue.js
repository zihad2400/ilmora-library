import Book from "@/models/Book";
import Category from "@/models/Category";

export async function buildBookQuery({ q, categorySlug, availability, sort }) {
  const query = { isArchived: { $ne: true } };

  // ১. সার্চ লজিক
  if (q && q.trim() !== "") {
    const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: safeQ, $options: "i" } },
      { description: { $regex: safeQ, $options: "i" } },
      { isbn: { $regex: safeQ, $options: "i" } },
    ];
  }

  // ২. ক্যাটাগরি লজিক
  if (categorySlug === "islamic-books") {
    const cats = await Category.find({ 
      name: { $in: ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature"] } 
    }).select("_id");
    query.category = { $in: cats.map(c => c._id) };
  } 
  else if (categorySlug === "cse-books") {
    const cats = await Category.find({ 
      name: { $in: ["CSE Books", "Programming", "Computer Science", "Web Development", "Database Management", "Software Engineering"] } 
    }).select("_id");
    query.category = { $in: cats.map(c => c._id) };
  } 
  else if (categorySlug && categorySlug !== "all") {
    const cat = await Category.findOne({ $or: [{ slug: categorySlug }, { name: { $regex: categorySlug.replace("-", " "), $options: "i" } }] });
    if (cat) {
      query.category = cat._id;
    } else {
      query.category = null;
    }
  }

  // ৩. Availability লজিক
  if (availability === "available") query.availableCopies = { $gt: 0 };
  if (availability === "borrowed") query.availableCopies = { $lte: 0 };

  // ৪. ইসলামিক ক্যাটাগরিগুলোর আইডি বের করা (সবসময় টপে রাখার জন্য)
  const islamicCats = await Category.find({ 
    name: { $in: ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature"] } 
  }).select("_id");
  const islamicCatIds = islamicCats.map(c => c._id);

  // ৫. সর্টিং লজিক
  let sortSpec = {};

  if (categorySlug === "islamic-books") {
    // ইসলামিক পেজে নরমাল সর্টিং
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title: { title: 1 },
      popular: { availableCopies: -1 },
    };
    sortSpec = sortMap[sort] || sortMap.newest;
  } else {
    // All Books পেজে: প্রথমে ইসলামিক ক্যাটাগরি, তারপর অন্য ক্যাটাগরি
    sortSpec = {
      // কাস্টম সর্টিং: ইসলামিক ক্যাটাগরি থাকলে ১, না থাকলে ২
      _islamicFirst: 1, 
      createdAt: -1
    };

    // MongoDB Aggregation ছাড়া সরাসরি Sort-এ কাস্টম ফিল্ড দেওয়া যায় না, 
    // তাই আমরা একটি ফেক ফিল্ড ব্যবহার করবো কুয়েরির সময়।
  }

  return { query, sort: sortSpec, islamicCatIds };
}
