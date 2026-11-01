// Usage: node -r dotenv/config scripts/seed-catalogue.js
// Idempotent seed: safe to re-run. Creates categories, authors, publishers,
// demo books, and physical copies if they don't already exist.
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Author from "../src/models/Author.js";
import Publisher from "../src/models/Publisher.js";
import Book from "../src/models/Book.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = [
  { name: "Islamic Books",   color: "#10b981", icon: "moon" },
  { name: "Quran & Tafsir",  color: "#14b8a6", icon: "book" },
  { name: "Hadith",          color: "#22c55e", icon: "scroll" },
  { name: "Islamic History", color: "#84cc16", icon: "landmark" },
  { name: "Islamic Literature", color: "#eab308", icon: "feather" },
  { name: "Islamic Education",  color: "#f59e0b", icon: "graduation" },
  { name: "CSE Books",       color: "#6366f1", icon: "cpu" },
  { name: "Programming",     color: "#8b5cf6", icon: "code" },
  { name: "Computer Science",color: "#a855f7", icon: "terminal" },
  { name: "Web Development", color: "#ec4899", icon: "globe" },
  { name: "Database Management", color: "#f43f5e", icon: "database" },
  { name: "Software Engineering", color: "#ef4444", icon: "layers" },
  { name: "Mathematics",     color: "#0ea5e9", icon: "sigma" },
  { name: "General Educational", color: "#06b6d4", icon: "library" },
];

const AUTHORS = [
  "Dr. Zakir Naik", "Ibn Kathir", "Imam Bukhari", "Imam Muslim",
  "Martin Kleppmann", "Robert C. Martin", "Kyle Simpson",
  "Douglas Crockford", "Thomas H. Cormen", "Ian Sommerville",
  "Abraham Silberschatz", "MDN Contributors", "Dan Abramov",
];

const PUBLISHERS = [
  "Darussalam", "Islamic Foundation", "O'Reilly Media",
  "Prentice Hall", "Addison-Wesley", "Pearson", "Wiley", "No Starch Press",
];

const BOOKS = [
  {
    title: "The Noble Quran — English Translation",
    authors: ["Dr. Zakir Naik"],
    publisher: "Darussalam",
    category: "Quran & Tafsir",
    isbn: "978-603-500-101-1",
    edition: "1st",
    publicationYear: 2020,
    language: "English",
    description: "A faithful English translation with short tafsir notes for daily reading.",
    shelfLocation: "A1-01",
    copies: 3,
  },
  {
    title: "Tafsir Ibn Kathir (Abridged, Vol. 1)",
    authors: ["Ibn Kathir"],
    publisher: "Darussalam",
    category: "Quran & Tafsir",
    isbn: "978-603-500-102-8",
    edition: "Abridged",
    publicationYear: 2019,
    language: "English",
    description: "Classic tafsir of the Qur'an, abridged for contemporary readers.",
    shelfLocation: "A1-02",
    copies: 2,
  },
  {
    title: "Sahih al-Bukhari — Complete Set",
    authors: ["Imam Bukhari"],
    publisher: "Darussalam",
    category: "Hadith",
    isbn: "978-603-500-103-5",
    edition: "1st",
    publicationYear: 2018,
    language: "English",
    description: "The most authentic collection of hadith after the Qur'an.",
    shelfLocation: "A2-01",
    copies: 2,
  },
  {
    title: "Sahih Muslim — Complete Set",
    authors: ["Imam Muslim"],
    publisher: "Darussalam",
    category: "Hadith",
    isbn: "978-603-500-104-2",
    edition: "1st",
    publicationYear: 2018,
    language: "English",
    description: "One of the two most authentic hadith collections (the Sahihayn).",
    shelfLocation: "A2-02",
    copies: 2,
  },
  {
    title: "Designing Data-Intensive Applications",
    authors: ["Martin Kleppmann"],
    publisher: "O'Reilly Media",
    category: "Database Management",
    isbn: "978-1449373320",
    edition: "1st",
    publicationYear: 2017,
    language: "English",
    description: "The definitive guide to modern distributed data systems.",
    shelfLocation: "B1-01",
    copies: 3,
  },
  {
    title: "Clean Code",
    authors: ["Robert C. Martin"],
    publisher: "Prentice Hall",
    category: "Software Engineering",
    isbn: "978-0132350884",
    edition: "1st",
    publicationYear: 2008,
    language: "English",
    description: "A handbook of agile software craftsmanship.",
    shelfLocation: "B1-02",
    copies: 3,
  },
  {
    title: "You Don't Know JS: Scope & Closures",
    authors: ["Kyle Simpson"],
    publisher: "O'Reilly Media",
    category: "Programming",
    isbn: "978-1449335588",
    edition: "1st",
    publicationYear: 2014,
    language: "English",
    description: "Deep dive into JavaScript's core mechanics.",
    shelfLocation: "B2-01",
    copies: 2,
  },
  {
    title: "JavaScript: The Good Parts",
    authors: ["Douglas Crockford"],
    publisher: "O'Reilly Media",
    category: "Programming",
    isbn: "978-0596517748",
    edition: "1st",
    publicationYear: 2008,
    language: "English",
    description: "The classic on the elegant subset of JavaScript.",
    shelfLocation: "B2-02",
    copies: 2,
  },
  {
    title: "Introduction to Algorithms (CLRS)",
    authors: ["Thomas H. Cormen"],
    publisher: "Addison-Wesley",
    category: "Computer Science",
    isbn: "978-0262046305",
    edition: "4th",
    publicationYear: 2022,
    language: "English",
    description: "The definitive algorithms textbook.",
    shelfLocation: "C1-01",
    copies: 3,
  },
  {
    title: "Software Engineering (10th Edition)",
    authors: ["Ian Sommerville"],
    publisher: "Pearson",
    category: "Software Engineering",
    isbn: "978-0133943030",
    edition: "10th",
    publicationYear: 2015,
    language: "English",
    description: "Comprehensive introduction to software engineering.",
    shelfLocation: "C1-02",
    copies: 2,
  },
  {
    title: "Database System Concepts",
    authors: ["Abraham Silberschatz"],
    publisher: "Pearson",
    category: "Database Management",
    isbn: "978-0078022159",
    edition: "7th",
    publicationYear: 2019,
    language: "English",
    description: "A rigorous introduction to database systems.",
    shelfLocation: "C2-01",
    copies: 2,
  },
  {
    title: "Eloquent JavaScript",
    authors: ["MDN Contributors"],
    publisher: "No Starch Press",
    category: "Web Development",
    isbn: "978-1593279509",
    edition: "3rd",
    publicationYear: 2018,
    language: "English",
    description: "A modern introduction to programming with JavaScript.",
    shelfLocation: "D1-01",
    copies: 2,
  },
  {
    title: "Just JavaScript",
    authors: ["Dan Abramov"],
    publisher: "O'Reilly Media",
    category: "Programming",
    isbn: "978-0000000001",
    edition: "1st",
    publicationYear: 2021,
    language: "English",
    description: "Mental models that make JavaScript click.",
    shelfLocation: "D1-02",
    copies: 2,
  },
  {
    title: "Discrete Mathematics and Its Applications",
    authors: ["Thomas H. Cormen"],
    publisher: "Pearson",
    category: "Mathematics",
    isbn: "978-1259676512",
    edition: "8th",
    publicationYear: 2018,
    language: "English",
    description: "A standard discrete mathematics text.",
    shelfLocation: "E1-01",
    copies: 2,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 connected to", MONGODB_URI);

  // Categories
  const catMap = {};
  for (const c of CATEGORIES) {
    const slug = slugify(c.name);
    const doc = await Category.findOneAndUpdate(
      { slug },
      { $setOnInsert: { name: c.name, slug, color: c.color, icon: c.icon } },
      { upsert: true, new: true }
    );
    catMap[c.name] = doc._id;
  }
  console.log("📚 categories:", Object.keys(catMap).length);

  // Authors
  const authorMap = {};
  for (const a of AUTHORS) {
    const doc = await Author.findOneAndUpdate(
      { name: a },
      { $setOnInsert: { name: a } },
      { upsert: true, new: true }
    );
    authorMap[a] = doc._id;
  }
  console.log("✍️  authors:", Object.keys(authorMap).length);

  // Publishers
  const pubMap = {};
  for (const p of PUBLISHERS) {
    const doc = await Publisher.findOneAndUpdate(
      { name: p },
      { $setOnInsert: { name: p } },
      { upsert: true, new: true }
    );
    pubMap[p] = doc._id;
  }
  console.log("🏢 publishers:", Object.keys(pubMap).length);

  // Books + copies
  let createdBooks = 0;
  let createdCopies = 0;

  for (const b of BOOKS) {
    let book = await Book.findOne({ isbn: b.isbn });
    if (!book) {
      book = await Book.create({
        title: b.title,
        authors: b.authors.map((n) => authorMap[n]).filter(Boolean),
        publisher: pubMap[b.publisher],
        category: catMap[b.category],
        isbn: b.isbn,
        edition: b.edition,
        publicationYear: b.publicationYear,
        language: b.language,
        description: b.description,
        shelfLocation: b.shelfLocation,
        totalCopies: 0,
        availableCopies: 0,
      });
      createdBooks++;
    }

    const existingCopies = await BookCopy.countDocuments({ book: book._id });
    const toCreate = Math.max(0, b.copies - existingCopies);

    for (let i = 0; i < toCreate; i++) {
      const idx = existingCopies + i + 1;
      const copyId = `${b.isbn.replace(/[^0-9]/g, "").slice(-6)}-C${String(idx).padStart(2, "0")}`;
      await BookCopy.create({
        book: book._id,
        copyId,
        status: "AVAILABLE",
        condition: "GOOD",
        shelfLocation: b.shelfLocation,
      });
      createdCopies++;
    }

    const total = await BookCopy.countDocuments({ book: book._id, status: { $ne: "ARCHIVED" } });
    const available = await BookCopy.countDocuments({ book: book._id, status: "AVAILABLE" });
    await Book.updateOne({ _id: book._id }, { totalCopies: total, availableCopies: available });
  }

  console.log("📖 books created:", createdBooks);
  console.log("📕 copies created:", createdCopies);
  console.log("✅ seed complete");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ seed failed:", e);
  process.exit(1);
});
