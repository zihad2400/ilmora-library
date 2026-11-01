import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";
import Author from "../src/models/Author.js";
import Category from "../src/models/Category.js";
import Publisher from "../src/models/Publisher.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

// ইসলামিক বই তৈরির ডেটা
const ISLAMIC_AUTHORS = [
  "ইমাম ইবনে তাইমিয়্যাহ", "ইমাম ইবনুল কাইয়্যিম", "শায়খ আব্দুল আজিজ বিন বায", 
  "শায়খ নাসিরুদ্দিন আল-আলবানী", "শায়খ সালেহ আল-উসাইমীন", "শায়খ সালেহ আল-ফাওযান",
  "ইমাম ইবনে কাসীর", "ইমাম গাজ্জালী", "ইমাম নববী", "ইবনে হাজার আসকালানী",
  "মাওলানা আব্দুল্লাহ জাহাঙ্গীর", "আবুল কালাম আজাদ", "মিজানুর রহমান আজহারী", 
  "শায়খ আহমাদুল্লাহ", "মুফতি তাকী উসমানী", "মাওলানা সাইয়েদ আবুল আ'লা মওদুদী"
];

const ISLAMIC_TOPICS = [
  "তাফসীর", "হাদীস", "আকীদা", "ফিকহ", "ইসলামের ইতিহাস", "সীরাত", "আত্মশুদ্ধি", 
  "দাওয়াহ", "পরিবার ও সমাজ", "নামাজ ও ইবাদত", "হালাল ও হারাম", "ইসলামী অর্থনীতি",
  "কুরআনের আলোকে", "সহীহ হাদীসের আলোকে", "ইসলামী রাজনীতি", "মহানবী (সা.) এর জীবনী"
];

// CSE বই তৈরির ডেটা
const CSE_AUTHORS = [
  "Robert C. Martin", "Martin Fowler", "Donald E. Knuth", "Thomas H. Cormen",
  "Andrew S. Tanenbaum", "Abraham Silberschatz", "Ian Sommerville", "Kyle Simpson",
  "Douglas Crockford", "Marijn Haverbeke", "David Flanagan", "Alex Xu",
  "Gayle Laakmann McDowell", "Aditya Bhargava", "Brian W. Kernighan", "Dennis M. Ritchie",
  "Joshua Bloch", "Scott Meyers", "Eric Evans", "Gene Kim", "Martin Kleppmann"
];

const CSE_TOPICS = [
  "Data Structures", "Algorithms", "Operating Systems", "Database Systems", 
  "Computer Networks", "Software Engineering", "Web Development", "Machine Learning",
  "Artificial Intelligence", "Deep Learning", "Computer Architecture", "Compiler Design",
  "Cybersecurity", "Cloud Computing", "Distributed Systems", "JavaScript", "Python",
  "React.js", "Node.js", "MongoDB", "SQL", "Clean Code", "Design Patterns", "Microservices"
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  const catMap = {};
  const catNames = ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature", "CSE Books", "Programming", "Computer Science", "Web Development", "Database Management", "Software Engineering"];
  
  for (const name of catNames) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name, slug: name.toLowerCase().replace(/ /g, "-") });
    }
    catMap[name] = cat._id;
  }

  let addedCount = 0;

  // ৫০০ ইসলামিক বই
  for (let i = 0; i < 500; i++) {
    const author = ISLAMIC_AUTHORS[Math.floor(Math.random() * ISLAMIC_AUTHORS.length)];
    const topic = ISLAMIC_TOPICS[Math.floor(Math.random() * ISLAMIC_TOPICS.length)];
    const title = `${topic} - খণ্ড ${i + 1} (${author})`;
    
    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    let authorDoc = await Author.findOne({ name: author });
    if (!authorDoc) authorDoc = await Author.create({ name: author });
    
    let pubDoc = await Publisher.findOne({ name: "Islamic Foundation" });
    if (!pubDoc) pubDoc = await Publisher.create({ name: "Islamic Foundation" });

    const book = await Book.create({
      title,
      authors: [authorDoc._id],
      publisher: pubDoc._id,
      category: catMap[topic.includes("তাফসীর") ? "Quran & Tafsir" : topic.includes("হাদীস") ? "Hadith" : topic.includes("ইতিহাস") ? "Islamic History" : "Islamic Education"],
      isbn,
      edition: "1st",
      publicationYear: 2010 + Math.floor(Math.random() * 15),
      language: "Bangla",
      description: `${title} - একটি গুরুত্বপূর্ণ ইসলামিক বই।`,
      shelfLocation: `ISL-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1,
      isArchived: false
    });

    await BookCopy.create({
      book: book._id,
      copyId: `${isbn.slice(-6)}-C01`,
      status: "AVAILABLE",
      condition: "GOOD",
      shelfLocation: book.shelfLocation
    });

    addedCount++;
    if (addedCount % 100 === 0) console.log(`✅ Added ${addedCount} books...`);
  }

  // ৫০০ CSE বই
  for (let i = 0; i < 500; i++) {
    const author = CSE_AUTHORS[Math.floor(Math.random() * CSE_AUTHORS.length)];
    const topic = CSE_TOPICS[Math.floor(Math.random() * CSE_TOPICS.length)];
    const title = `${topic}: A Comprehensive Guide (Vol ${i + 1})`;
    
    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    let authorDoc = await Author.findOne({ name: author });
    if (!authorDoc) authorDoc = await Author.create({ name: author });
    
    let pubDoc = await Publisher.findOne({ name: "O'Reilly Media" });
    if (!pubDoc) pubDoc = await Publisher.create({ name: "O'Reilly Media" });

    const book = await Book.create({
      title,
      authors: [authorDoc._id],
      publisher: pubDoc._id,
      category: catMap[topic.includes("Web") || topic.includes("React") ? "Web Development" : topic.includes("Database") || topic.includes("SQL") || topic.includes("MongoDB") ? "Database Management" : topic.includes("Software") || topic.includes("Clean") || topic.includes("Pattern") ? "Software Engineering" : "Computer Science"],
      isbn,
      edition: "1st",
      publicationYear: 2015 + Math.floor(Math.random() * 10),
      language: "English",
      description: `${title} - প্রফেশনাল CSE বই।`,
      shelfLocation: `CSE-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1,
      isArchived: false
    });

    await BookCopy.create({
      book: book._id,
      copyId: `${isbn.slice(-6)}-C01`,
      status: "AVAILABLE",
      condition: "GOOD",
      shelfLocation: book.shelfLocation
    });

    addedCount++;
    if (addedCount % 100 === 0) console.log(`✅ Added ${addedCount} books...`);
  }

  console.log(`🎉 Successfully added ${addedCount} new premium books!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
