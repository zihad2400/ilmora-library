import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Author from "@/models/Author";
import Publisher from "@/models/Publisher";
import Category from "@/models/Category";
import PublicNav from "@/components/layout/PublicNav";
import BooksClient from "@/components/books/BooksClient";
import { buildBookQuery } from "@/services/catalogue";
import { Suspense } from "react";
import { connection } from "next/server";

export const instant = false;

async function getBooksData(searchParams) {
  await connectDB();
  
  const q = searchParams.q || "";
  const categorySlug = searchParams.category || "";
  const availability = searchParams.availability || "";
  const sort = searchParams.sort || "newest";

  let categoryName = "All Books";
  if (categorySlug === "islamic-books") categoryName = "Islamic Books";
  else if (categorySlug === "cse-books") categoryName = "CSE Books";
  else if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug });
    if (cat) categoryName = cat.name;
  }

  // ইসলামিক ক্যাটাগরির আইডি বের করা (টপে শো করার জন্য)
  const islamicCategories = await Category.find({
    name: { $in: ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature"] }
  }).select("_id");
  const islamicCatIds = islamicCategories.map(c => c._id.toString());

  const { query, sort: sortSpec } = await buildBookQuery({ 
    q, 
    categorySlug, 
    availability, 
    sort 
  });

  let books = await Book.find(query)
    .populate("authors", "name")
    .populate("publisher", "name")
    .populate("category", "name slug color")
    .sort(sortSpec)
    .limit(100) // একটু বেশি লিমিট দিলাম যাতে সর্টিং ঠিকমতো হয়
    .lean();

  // যদি All Books পেজ হয় (কোনো নির্দিষ্ট ক্যাটাগরি সিলেক্ট না থাকে), তবে ইসলামিক বই আগে রাখো
  if (!categorySlug || categorySlug === "all") {
    books.sort((a, b) => {
      const aIsIslamic = islamicCatIds.includes(a.category?._id?.toString());
      const bIsIslamic = islamicCatIds.includes(b.category?._id?.toString());
      
      // যদি একটি ইসলামিক হয় আর অন্যটি না হয়, তবে ইসলামিক বই আগে যাবে
      if (aIsIslamic && !bIsIslamic) return -1;
      if (!aIsIslamic && bIsIslamic) return 1;
      
      // দুইটাই ইসলামিক বা দুইটাই না হলে, নতুন বই আগে যাবে
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  // লিমিট 60 এ নামিয়ে আনা
  books = books.slice(0, 60);

  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return { 
    books: JSON.parse(JSON.stringify(books)), 
    categories: JSON.parse(JSON.stringify(categories)),
    categoryName
  };
}

export default async function BooksPage({ searchParams }) {
  await connection();
  const params = await searchParams;
  
  const { books, categories, categoryName } = await getBooksData(params);

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">{categoryName}</h1>
          <p className="text-sm text-gray-400">
            Showing <span className="text-white font-bold">{books.length}</span> books from the library
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-400 py-20">Loading books...</div>}>
          <BooksClient initialBooks={books} categories={categories} />
        </Suspense>
      </main>
    </>
  );
}
