import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Author from "../src/models/Author.js";
import Publisher from "../src/models/Publisher.js";
import Book from "../src/models/Book.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

const BOOKS = [
  // ==========================================
  // ১. আপনার ছবিতে থাকা বইগুলো (From Images)
  // ==========================================
  { title: "৮০ হাদীস", author: "ড. মুহাম্মদ হকিম", cat: "Hadith", lang: "Bangla" },
  { title: "রমজান মাসের ৩০ আসর", author: "শায়খ সালেহ আল-উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "বিবাহ পূর্ব প্রস্তুতি", author: "তানযিল আরেফিন আদনান", cat: "Islamic Literature", lang: "Bangla" },
  { title: "আকাবির পাড়ায়", author: "মাহমুদা খাতুন", cat: "Islamic Literature", lang: "Bangla" },
  { title: "বিবাহ, পরিবার ও সন্তান প্রতিপালন", author: "মুহাম্মদ আসাদুল্লাহ আল-গালিব", cat: "Islamic Education", lang: "Bangla" },
  { title: "রিয়াদুস সালিহীন", author: "ইমাম নববী", cat: "Hadith", lang: "Bangla" },
  { title: "আল-আদাবুল মুফরাদ", author: "ইমাম বুখারী", cat: "Hadith", lang: "Bangla" },
  { title: "সীরাতে খাতামুন নাবিয়্যীন", author: "আল্লামা শিবলী নোমানী", cat: "Islamic History", lang: "Bangla" },
  { title: "বেহেশতী জেওর", author: "মাওলানা আশরাফ আলী থানভী", cat: "Islamic Education", lang: "Bangla" },
  { title: "আর-রাহীকুল মাখতূম", author: "সফিউর রহমান মোবারকপুরী", cat: "Islamic History", lang: "Bangla" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", cat: "Software Engineering", lang: "English" },
  { title: "Clean Architecture", author: "Robert C. Martin", cat: "Software Engineering", lang: "English" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", cat: "Programming", lang: "English" },
  { title: "HTML & CSS: Design and Build Websites", author: "Jon Duckett", cat: "Web Development", lang: "English" },
  { title: "Introduction to Algorithms (CLRS)", author: "Thomas H. Cormen", cat: "Computer Science", lang: "English" },
  { title: "Clean Code", author: "Robert C. Martin", cat: "Software Engineering", lang: "English" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", cat: "Database Management", lang: "English" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", cat: "Programming", lang: "English" },

  // ==========================================
  // ২. সালাফি মানহাজের ১০০+ দেশি-বিদেশি বই
  // ==========================================
  
  // --- আকীদা ও তাওহীদ (Aqeedah & Tawheed) ---
  { title: "কিতাবুত তাওহীদ", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব", cat: "Islamic Education", lang: "Bangla" },
  { title: "তিনটি মূলনীতি (থালাথাতুল উসূল)", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব", cat: "Islamic Education", lang: "Bangla" },
  { title: "চারটি মূলনীতি (আল-কাওয়াইদুল আরবা)", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-আকীদাতুল ওয়াসিতিয়্যাহ", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Islamic Education", lang: "Bangla" },
  { title: "শারহে আকীদাতুত তহাবিয়্যাহ", author: "ইবনে আবি আল-ইয্য", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-ইরশাদ ইলা সহীহিল ইতিকাদ", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "আকীদাতুস সালাফ ওয়া আসহাবুল হাদীস", author: "শায়খ নাসিরুদ্দিন আল-আলবানী", cat: "Islamic Education", lang: "Bangla" },
  { title: "শারহুল আকীদাতিল ওয়াসিতিয়্যাহ", author: "শায়খ সালেহ আল-উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-কুরআন ওয়াল ঈমান", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Islamic Education", lang: "Bangla" },
  { title: "কিতাবুল ঈমান", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-ওয়াসিতিয়্যাহ (ইংরেজি)", author: "Ibn Taymiyyah", cat: "Islamic Education", lang: "English" },
  { title: "Kitab At-Tawheed (English)", author: "Muhammad bin Abdul Wahhab", cat: "Islamic Education", lang: "English" },
  { title: "The Three Fundamental Principles (English)", author: "Muhammad bin Abdul Wahhab", cat: "Islamic Education", lang: "English" },
  { title: "Explanation of the Three Fundamental Principles", author: "Shaykh Saleh Al-Fawzan", cat: "Islamic Education", lang: "English" },
  { title: "Aqeedah al-Wasitiyyah (English)", author: "Ibn Taymiyyah", cat: "Islamic Education", lang: "English" },

  // --- হাদীস (Hadith) ---
  { title: "সিলসিলাতুল আহাদীস আস-সহীহা (১ম-১০ম খণ্ড)", author: "শায়খ নাসিরুদ্দিন আল-আলবানী", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহ আত-তারগীব ওয়াত তারহীব", author: "শায়খ নাসিরুদ্দিন আল-আলবানী", cat: "Hadith", lang: "Bangla" },
  { title: "সহীহুল জামে'", author: "শায়খ নাসিরুদ্দিন আল-আলবানী", cat: "Hadith", lang: "Bangla" },
  { title: "সুনানে আবু দাউদ (আলবানী যাচাইকৃত)", author: "ইমাম আবু দাউদ", cat: "Hadith", lang: "Bangla" },
  { title: "সুনানে তিরমিজী (আলবানী যাচাইকৃত)", author: "ইমাম তিরমিজী", cat: "Hadith", lang: "Bangla" },
  { title: "বুলুগুল মারাম", author: "হাফেজ ইবনে হাজার আসকালানী", cat: "Hadith", lang: "Bangla" },
  { title: "উমদাতুল আহকাম", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Hadith", lang: "Bangla" },
  { title: "আস-সুনান আল-কুবরা", author: "ইমাম নাসাঈ", cat: "Hadith", lang: "Bangla" },
  { title: "Sahih Al-Bukhari (English)", author: "Imam Bukhari", cat: "Hadith", lang: "English" },
  { title: "Sahih Muslim (English)", author: "Imam Muslim", cat: "Hadith", lang: "English" },
  { title: "Riyad As-Salihin (English)", author: "Imam Nawawi", cat: "Hadith", lang: "English" },
  { title: "Bulugh Al-Maram (English)", author: "Ibn Hajar Al-Asqalani", cat: "Hadith", lang: "English" },
  { title: "Umdatul Ahkam (English)", author: "Ibn Taymiyyah", cat: "Hadith", lang: "English" },
  { title: "The Prophet's Prayer Described", author: "Shaykh Nasiruddin Al-Albani", cat: "Hadith", lang: "English" },

  // --- ফিকহ (Fiqh) ---
  { title: "শারহুল মুমতি' (১ম-১৫তম খণ্ড)", author: "শায়খ সালেহ আল-উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "আল-মুলাখখাস আল-ফিকহী", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফিকহুস সুন্নাহ", author: "সাইয়েদ সাবেক", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফাতাওয়া আরকানুল ইসলাম", author: "শায়খ সালেহ আল-উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "মাজমুউল ফাতাওয়া (৩৭ খণ্ড)", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফতোয়ায়ে ইবনে বায (১ম-৩০তম খণ্ড)", author: "শায়খ আব্দুল আজিজ বিন বায", cat: "Islamic Education", lang: "Bangla" },
  { title: "ফাতাওয়া নূরুন আলাদ দারব", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "সালাতুল মুমিন", author: "শায়খ নাসিরুদ্দিন আল-আলবানী", cat: "Islamic Education", lang: "Bangla" },
  { title: "আহকামুন নিসা (নারীদের বিধান)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "মুয়ামালাত (ব্যবসা-বাণিজ্যের বিধান)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education", lang: "Bangla" },
  { title: "Fiqh Made Easy", author: "Shaykh Saleh Al-Fawzan", cat: "Islamic Education", lang: "English" },
  { title: "The Concise Presentation of Fiqh", author: "Shaykh Saleh Al-Fawzan", cat: "Islamic Education", lang: "English" },
  { title: "Fiqh of Worship", author: "Shaykh Saleh Al-Uthaymeen", cat: "Islamic Education", lang: "English" },
  { title: "Prayer According to the Sunnah", author: "Shaykh Nasiruddin Al-Albani", cat: "Islamic Education", lang: "English" },
  { title: "The Book of Marriage", author: "Shaykh Saleh Al-Uthaymeen", cat: "Islamic Education", lang: "English" },

  // --- আত্মশুদ্ধি ও আদব (Tazkiyah & Adab) ---
  { title: "তাযকিয়াতুন নাফস", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Literature", lang: "Bangla" },
  { title: "আল-ফাওয়াইদ", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature", lang: "Bangla" },
  { title: "উদাতুস সাবিরীন", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature", lang: "Bangla" },
  { title: "তরিকুল হিজরাতাইন", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature", lang: "Bangla" },
  { title: "ইগাছাতুল লাহফান", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature", lang: "Bangla" },
  { title: "লাতাইফুল মাআরিফ", author: "ইমাম ইবনে রজব আল-হাম্বলী", cat: "Islamic Literature", lang: "Bangla" },
  { title: "মিনহাজুল মুসলিম", author: "আবু বকর জাবির আল-জাযায়েরী", cat: "Islamic Literature", lang: "Bangla" },
  { title: "রিয়াদুস সালিহীন (আত্মশুদ্ধি)", author: "ইমাম নববী", cat: "Islamic Literature", lang: "Bangla" },
  { title: "Purification of the Soul", author: "Ibn Qayyim Al-Jawziyya", cat: "Islamic Literature", lang: "English" },
  { title: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)", author: "Safiur Rahman Mubarakpuri", cat: "Islamic History", lang: "English" },
  { title: "Usool Al-Thalatha (English)", author: "Muhammad bin Abdul Wahhab", cat: "Islamic Education", lang: "English" },
  { title: "The Book of Tawheed (English)", author: "Muhammad bin Abdul Wahhab", cat: "Islamic Education", lang: "English" },

  // --- ইসলামিক ইতিহাস ও জীবনী (History & Biography) ---
  { title: "সীরাতে ইবনে হিশাম", author: "ইবনে হিশাম", cat: "Islamic History", lang: "Bangla" },
  { title: "যাদুল মাআদ (১ম-৫ম খণ্ড)", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic History", lang: "Bangla" },
  { title: "আল-বিদায়া ওয়ান নিহায়া", author: "ইমাম ইবনে কাসীর", cat: "Islamic History", lang: "Bangla" },
  { title: "সিয়ারু আলাম আন-নুবালা", author: "ইমাম আয-যাহাবী", cat: "Islamic History", lang: "Bangla" },
  { title: "নবীদের কাহিনী", author: "ইমাম ইবনে কাসীর", cat: "Islamic History", lang: "Bangla" },
  { title: "সাহাবীদের জীবনী (হায়াতুস সাহাবা)", author: "মাওলানা ইউসুফ কান্ধলভী", cat: "Islamic History", lang: "Bangla" },
  { title: "খিলাফতে রাশেদার ইতিহাস", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic History", lang: "Bangla" },
  { title: "উমার ইবনুল খাত্তাব (রা.) এর জীবনী", author: "আলী মুহাম্মদ আস-সাল্লাবী", cat: "Islamic History", lang: "Bangla" },
  { title: "আবু বকর (রা.) এর জীবনী", author: "আলী মুহাম্মদ আস-সাল্লাবী", cat: "Islamic History", lang: "Bangla" },
  { title: "উসমান ইবন আফফান (রা.) এর জীবনী", author: "আলী মুহাম্মদ আস-সাল্লাবী", cat: "Islamic History", lang: "Bangla" },
  { title: "আলী ইবন আবী তালিব (রা.) এর জীবনী", author: "আলী মুহাম্মদ আস-সাল্লাবী", cat: "Islamic History", lang: "Bangla" },
  { title: "The Biography of Abu Bakr As-Siddiq", author: "Dr. Ali Muhammad As-Sallabi", cat: "Islamic History", lang: "English" },
  { title: "The Biography of Umar Ibn Al-Khattab", author: "Dr. Ali Muhammad As-Sallabi", cat: "Islamic History", lang: "English" },
  { title: "The Biography of Uthman Ibn Affan", author: "Dr. Ali Muhammad As-Sallabi", cat: "Islamic History", lang: "English" },
  { title: "The Biography of Ali Ibn Abi Talib", author: "Dr. Ali Muhammad As-Sallabi", cat: "Islamic History", lang: "English" },
  { title: "Stories of the Prophets (English)", author: "Ibn Kathir", cat: "Islamic History", lang: "English" },

  // --- সমসাময়িক ফতোয়া ও ফিকহ (Contemporary Fatawa) ---
  { title: "ফতোয়া আরকান (নামাজ, রোজা, হজ্জ, যাকাত)", author: "শায়খ ইবনে বায", cat: "Islamic Education", lang: "Bangla" },
  { title: "আহকামুল জানায়েয (মৃত ব্যক্তির বিধান)", author: "শায়খ আলবানী", cat: "Islamic Education", lang: "Bangla" },
  { title: "আদাবুল মুআশারাত (সামাজিক আদব)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Literature", lang: "Bangla" },
  { title: "হক্কুল জার (প্রতিবেশীর হক)", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Literature", lang: "Bangla" },
  { title: "সন্তান প্রতিপালন (তরবিয়াতুল আওলাদ)", author: "শায়খ মুহাম্মদ নাসিরুদ্দিন আল-আলবানী", cat: "Islamic Education", lang: "Bangla" },
  { title: "স্ত্রীর অধিকার ও কর্তব্য", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education", lang: "Bangla" },
  { title: "The Islamic Ruling on Music and Singing", author: "Shaykh Nasiruddin Al-Albani", cat: "Islamic Education", lang: "English" },
  { title: "The Etiquette of Seeking Knowledge", author: "Shaykh Bakr Abu Zayd", cat: "Islamic Literature", lang: "English" },
  { title: "The Rights of the Neighbors", author: "Shaykh Saleh Al-Fawzan", cat: "Islamic Literature", lang: "English" }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ১. আগের সব বই এবং কপি ডিলিট করা
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

  // ৩. নতুন বই যোগ করা
  for (const b of BOOKS) {
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
      description: `${b.title} - সংকলিত বই।`,
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

  console.log(`🎉 Success! Added ${addedCount} Salafi Manhaj books including your photo books.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
