import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";
import Author from "../src/models/Author.js";
import Category from "../src/models/Category.js";
import Publisher from "../src/models/Publisher.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

const ISLAMIC_BOOKS = [
  "কুরআনুল কারীম", "তাফসীর ইবনে কাসীর", "তাফসীরে জালালাইন", "তাফহীমুল কুরআন", "মাআরিফুল হাদীস", "মিশকাতুল মাসাবীহ", "সুনানে আবু দাউদ", "সুনানে তিরমিজী", "সুনানে নাসাঈ", "সুনানে ইবনে মাজাহ", "মুয়াত্তা মালিক", "রিয়াদুস সালিহীন", "আল-আদাবুল মুফরাদ", "বুখারী শরীফ", "মুসলিম শরীফ", "আর-রাহীকুল মাখতূম", "সীরাতে রাসূলুল্লাহ", "সীরাতে খাতামুন নাবিয়্যীন", "খিলাফতের ইতিহাস", "মাকতুবাত", "মাসনবী শরীফ", "গুলিস্তাঁ", "বোস্তাঁ", "ইহইয়াউ উলুমিদ্দীন", "কিমিয়ায়ে সা'আদাত", "তালীমুল ইসলাম", "ফিকহুস সুন্নাহ", "বেহেশতী জেওর", "নুরুল ইসলাম", "মুসলিম চরিত্র", "হায়াতুস সাহাবা", "ফাযায়েলে আমল", "রাসূলুল্লাহ (সা.) এর নামাজ", "নামাজের ব্যবহারিক বিধান", "রোজার বিধান", "হজ্জ ও উমরাহ", "যাকাতের বিধান", "মুসলিম জীবনের মূলনীতি", "ইসলামের রাজনৈতিক মতবাদ", "তাওহীদের শিক্ষা", "নবীদের কাহিনী", "সাহাবীদের জীবনী", "তাবেঈদের জীবনী", "ইসলামের ইতিহাস", "কুরআন ও বিজ্ঞান", "৮০ হাদীস", "রমজান মাসের ৩০ আসর", "বিবাহ পূর্ব প্রস্তুতি", "আকাবির পাড়ায়", "বিবাহ, পরিবার ও সন্তান প্রতিপালন"
];

const CSE_BOOKS = [
  "Introduction to Algorithms (CLRS)", "Clean Code", "Clean Architecture", "Designing Data-Intensive Applications", "The Pragmatic Programmer", "Eloquent JavaScript", "You Don't Know JS Yet", "JavaScript: The Good Parts", "JavaScript: The Definitive Guide", "HTML and CSS: Design and Build Websites", "Operating System Concepts", "Database System Concepts", "Computer Networking: A Top-Down Approach", "Compilers: Principles, Techniques, and Tools", "Artificial Intelligence: A Modern Approach", "Software Engineering", "The C Programming Language", "Effective Java", "Head First Design Patterns", "Refactoring: Improving the Design of Existing Code", "Python Crash Course", "Automate the Boring Stuff with Python", "Learning Python", "Deep Learning", "Hands-On Machine Learning", "Code: The Hidden Language of Computer Hardware", "Structure and Interpretation of Computer Programs", "The Mythical Man-Month", "The Art of Computer Programming", "Grokking Algorithms", "Cracking the Coding Interview", "System Design Interview", "Computer Organization and Design", "Modern Operating Systems", "Distributed Systems", "Computer Networks", "Learning SQL", "SQL Antipatterns", "MongoDB: The Definitive Guide", "The Phoenix Project", "Continuous Delivery", "Domain-Driven Design", "Working Effectively with Legacy Code", "Test Driven Development: By Example", "React: Up & Running", "Learning React", "Node.js Design Patterns", "Fullstack React", "CSS: The Definitive Guide", "The Linux Command Line", "The Git Pro"
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ক্যাটাগরি চেক এবং তৈরি
  const catMap = {};
  const catNames = ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature", "CSE Books", "Programming", "Computer Science", "Web Development", "Database Management", "Software Engineering"];
  
  for (const name of catNames) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name, slug: name.toLowerCase().replace(/ /g, "-") });
    }
    catMap[name] = cat._id;
  }

  const defaultAuthor = await Author.findOne({ name: "Unknown Author" }) || await Author.create({ name: "Unknown Author" });
  const defaultPublisher = await Publisher.findOne({ name: "Unknown Publisher" }) || await Publisher.create({ name: "Unknown Publisher" });

  let addedCount = 0;

  const allBooks = [
    ...ISLAMIC_BOOKS.map(t => ({ title: t, cat: t.includes("কুরআন") || t.includes("তাফসীর") ? "Quran & Tafsir" : t.includes("হাদীস") ? "Hadith" : t.includes("ইতিহাস") || t.includes("সীরাত") ? "Islamic History" : "Islamic Education" })),
    ...CSE_BOOKS.map(t => ({ title: t, cat: t.includes("JavaScript") || t.includes("Python") || t.includes("C Programming") ? "Programming" : t.includes("Web") || t.includes("HTML") || t.includes("CSS") || t.includes("React") ? "Web Development" : t.includes("Database") || t.includes("SQL") || t.includes("MongoDB") ? "Database Management" : t.includes("Code") || t.includes("Software") || t.includes("Testing") || t.includes("Architecture") ? "Software Engineering" : "Computer Science" }))
  ];

  for (const b of allBooks) {
    // ডুপ্লিকেট চেক
    const exists = await Book.findOne({ title: b.title });
    if (exists) continue;

    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    const book = await Book.create({
      title: b.title,
      authors: [defaultAuthor._id],
      publisher: defaultPublisher._id,
      category: catMap[b.cat],
      isbn: isbn,
      language: b.title.includes("JavaScript") || b.title.includes("Clean Code") ? "English" : "Bangla", // এখানে 'Bangla' শুধু ডেটা হিসেবে সেভ হবে, ইনডেক্সিং এ সমস্যা হবে না
      description: `${b.title} - লাইব্রেরির জন্য সংগৃহীত একটি চমৎকার বই।`,
      shelfLocation: `S-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1,
      isArchived: false
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

  console.log(`🎉 Successfully added ${addedCount} new books!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
