import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Author from "../src/models/Author.js";
import Publisher from "../src/models/Publisher.js";
import Book from "../src/models/Book.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

// খাঁটি সালাফি মানহাজের নির্ভরযোগ্য বইয়ের তালিকা
const SALAFI_BOOKS = [
  // --- আকীদা (Aqeedah) ---
  { title: "কিতাবুত তাওহীদ", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-আকীদাতুল ওয়াসিতিয়্যাহ", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-আকীদাতুল হামাবিয়্যাহ", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "আকীদাতুস সালাফ", author: "শায়খ নাসিরুদ্দিন আল-আলবানী (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "শারহে আকীদাতুত তহাবিয়্যাহ", author: "ইবনে আবি আল-ইয্য (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "তাওহীদের কালিমা", author: "শায়খ সালেহ আল-উসাইমীন (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "তিনটি মূলনীতি", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "চারটি মূলনীতি", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "কিতাবুল ঈমান", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-ইরশাদ (সঠিক আকীদা)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },

  // --- হাদীস (Hadith) ---
  { title: "সিলসিলাতুল আহাদীস আস-সহীহা", author: "শায়খ নাসিরুদ্দিন আল-আলবানী (রহ.)", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহুল বুখারী", author: "ইমাম মুহাম্মদ বিন ইসমাইল বুখারী", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহ মুসলিম", author: "ইমাম মুসলিম ইবনে হাজ্জাজ", cat: "Hadith", lang: "Bangla" },
  { title: "সুনানে আবু দাউদ (আলবানী কর্তৃক যাচাইকৃত)", author: "ইমাম আবু দাউদ", cat: "Hadith", lang: "Bangla" },
  { title: "সুনানে তিরমিজী (আলবানী কর্তৃক যাচাইকৃত)", author: "ইমাম তিরমিজী", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহ আত-তারগীব ওয়াত তারহীব", author: "শায়খ নাসিরুদ্দিন আল-আলবানী (রহ.)", cat: "Hadith", lang: "Bangla" },
  { title: "রিয়াদুস সালিহীন", author: "ইমাম নববী (রহ.)", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহুল আদাবুল মুফরাদ", author: "ইমাম বুখারী", cat: "Hadith", lang: "Bangla" },
  { title: "বুলুগুল মারাম", author: "হাফেজ ইবনে হাজার আসকালানী (রহ.)", cat: "Hadith", lang: "Bangla" },
  { title: "উমদাতুল আহকাম", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)", cat: "Hadith", lang: "Bangla" },

  // --- ফিকহ (Fiqh) ---
  { title: "ফিকহুস সুন্নাহ", author: "সাইয়েদ সাবেক (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "শারহুল মুমতি' (হাদীস অনুযায়ী ফিকহ)", author: "শায়খ সালেহ আল-উসাইমীন (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-মুলাখখাস আল-ফিকহী", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "সালাতুল মুমিন (নামাজের বিধান)", author: "শায়খ নাসিরুদ্দিন আল-আলবানী (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "হজ্জ ও উমরাহর বিধান", author: "শায়খ মুহাম্মদ বিন সালেহ আল-উসাইমীন (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "যাকাত ও রোজার বিধান", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফতোয়া আরকানুল ইসলাম", author: "শায়খ মুহাম্মদ বিন সালেহ আল-উসাইমীন (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "মাজমুউল ফাতাওয়া", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফতোয়ায়ে ইবনে বায", author: "শায়খ আব্দুল আজিজ বিন বায (রহ.)", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফাতাওয়া নূরুন আলাদ দারব", author: "শায়খ ইবনে উসাইমীন (রহ.)", cat: "Islamic Education", lang: "Bangla" },

  // --- ইসলামিক ইতিহাস ও জীবনী ---
  { title: "আর-রাহীকুল মাখতূম", author: "সফিউর রহমান মোবারকপুরী (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "সীরাতে নববী (ইবনে হিশাম)", author: "ইবনে হিশাম (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "যাদুল মাআদ", author: "ইমাম ইবনুল কাইয়্যিম (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "নবীদের কাহিনী (কিসাসুল আম্বিয়া)", author: "ইমাম ইবনে কাসীর (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "আল-বিদায়া ওয়ান নিহায়া", author: "ইমাম ইবনে কাসীর (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "সিয়ারু আলাম আন-নুবালা", author: "ইমাম আয-যাহাবী (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "মানহাজে সালাফ", author: "শায়খ নাসিরুদ্দিন আল-আলবানী (রহ.)", cat: "Islamic History", lang: "Bangla" },
  { title: "সালাফদের জীবনাদর্শ", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic History", lang: "Bangla" },
  { title: "জ্ঞান ও প্রজ্ঞার আলোকে সালাফদের জীবনী", author: "শায়খ আব্দুর রাযযাক আল-বাদর", cat: "Islamic History", lang: "Bangla" },
  { title: "তাবেঈদের ইতিহাস", author: "ইমাম আয-যাহাবী (রহ.)", cat: "Islamic History", lang: "Bangla" },

  // --- আত্মশুদ্ধি ও আদব (Tazkiyah & Adab) ---
  { title: "তাযকিয়াতুন নাফস (আত্মশুদ্ধি)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Literature", lang: "Bangla" },
  { title: "আল-ফাওয়াইদ (জীবনের উপদেশ)", author: "ইমাম ইবনুল কাইয়্যিম (রহ.)", cat: "Islamic Literature", lang: "Bangla" },
  { title: "উদাতুস সাবিরীন (ধৈর্যের উপহার)", author: "ইমাম ইবনুল কাইয়্যিম (রহ.)", cat: "Islamic Literature", lang: "Bangla" },
  { title: "লাতাইফুল মাআরিফ", author: "ইমাম ইবনে রজব আল-হাম্বলী (রহ.)", cat: "Islamic Literature", lang: "Bangla" },
  { title: "রিয়াদুস সালিহীন (আত্মশুদ্ধির হাদীস)", author: "ইমাম নববী (রহ.)", cat: "Islamic Literature", lang: "Bangla" },
  { title: "মিনহাজুল মুসলিম", author: "শায়খ আবু বকর জাবির আল-জাযায়েরী", cat: "Islamic Literature", lang: "Bangla" },
  { title: "দুআ ও যিকির (হিসনুল মুসলিম)", author: "সাঈদ ইবনে আলী ইবনে ওয়াহফ আল-কাহতানী", cat: "Islamic Education", lang: "Bangla" },
  { title: "রুকইয়াহ (কুরআন দিয়ে চিকিৎসা)", author: "শায়খ আব্দুল্লাহ বিন মুহাম্মদ আস-সাদহান", cat: "Islamic Education", lang: "Bangla" },
  { title: "পাপ থেকে বাঁচার উপায়", author: "শায়খ ইবনে উসাইমীন (রহ.)", cat: "Islamic Literature", lang: "Bangla" },
  { title: "মৃত্যুর স্মরণ ও পরকালের প্রস্তুতি", author: "শায়খ ইবনে উসাইমীন (রহ.)", cat: "Islamic Literature", lang: "Bangla" }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ১. আগের সব বই এবং কপি ডিলিট করা (যাতে শুধু সালাফি বই থাকে)
  await Book.deleteMany({});
  await BookCopy.deleteMany({});
  console.log("🧹 Cleared old books and copies.");

  // ২. ক্যাটাগরি ম্যাপ তৈরি
  const categories = await Category.find({});
  const catMap = {};
  categories.forEach(c => catMap[c.name] = c._id);

  // "General Educational" ক্যাটাগরি ডিলিট করা
  await Category.deleteOne({ name: "General Educational" });

  const defaultPublisher = await Publisher.findOne({}) || await Publisher.create({ name: "Salafi Publications" });
  const defaultCategory = categories[0]?._id;

  let addedCount = 0;

  // ৩. নতুন সালাফি বই যোগ করা
  for (const b of SALAFI_BOOKS) {
    let author = await Author.findOne({ name: b.author });
    if (!author) {
      author = await Author.create({ name: b.author });
    }

    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    const book = await Book.create({
      title: b.title,
      authors: [author._id],
      publisher: defaultPublisher._id,
      category: catMap[b.cat] || defaultCategory,
      isbn: isbn,
      language: b.lang,
      description: `${b.title} - সালাফি মানহাজ অনুযায়ী সংকলিত একটি গুরুত্বপূর্ণ বই।`,
      shelfLocation: `SLF-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1
    });

    await BookCopy.create({
      book: book._id,
      copyId: `${isbn.replace(/[^0-9]/g, "").slice(-6)}-C01`,
      status: "AVAILABLE",
      condition: "GOOD",
      shelfLocation: book.shelfLocation
    });

    addedCount++;
  }

  console.log(`🎉 Success! Added ${addedCount} pure Salafi Manhaj books.`);
  console.log(`❌ Removed "General Educational" category and old books.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
