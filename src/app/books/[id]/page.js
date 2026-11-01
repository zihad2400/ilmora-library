import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Author from "@/models/Author";
import Publisher from "@/models/Publisher";
import Category from "@/models/Category";
import BookCopy from "@/models/BookCopy";
import PublicNav from "@/components/layout/PublicNav";
import { connection } from "next/server";

export const instant = false;

export default async function BookDetail({ params }) {
  await connection();
  const { id } = await params;
  await connectDB();

  let book;
  try {
    book = await Book.findById(id)
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("category", "name slug color")
      .lean();
  } catch {
    return notFound();
  }
  
  if (!book || book.isArchived) return notFound();

  const availableCopies = await BookCopy.find({ book: id, status: "AVAILABLE" })
    .select("copyId shelfLocation condition")
    .lean();

  const color = book.category?.color || "#7c3aed";

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 relative min-h-screen">
        {/* Background Glows */}
        <div 
          className="absolute top-10 left-1/4 -z-10 h-72 w-72 rounded-full blur-[120px] opacity-20"
          style={{ background: color }}
        ></div>
        <div 
          className="absolute bottom-10 right-1/4 -z-10 h-72 w-72 rounded-full blur-[120px] opacity-10"
          style={{ background: "#10b981" }}
        ></div>

        <Link href="/books" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 md:mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to catalogue
        </Link>

        <div className="grid gap-8 md:gap-10 md:grid-cols-3 items-start">
          
          {/* বাম দিকের কভার (মোবাইলে সেন্টার, ডেস্কটপে স্টিকি) */}
          <div className="md:col-span-1 md:sticky md:top-24 max-w-[280px] mx-auto md:max-w-none w-full">
            <div
              className="group relative flex aspect-[3/4] items-center justify-center rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
              style={{
                background: book.coverImageUrl
                  ? `url(${book.coverImageUrl}) center/cover`
                  : `linear-gradient(145deg, ${color}30, #0a0e1a)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 opacity-90"></div>
              
              {!book.coverImageUrl && (
                <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div 
                    className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${color}50, rgba(15, 23, 42, 0.9))`,
                      boxShadow: `0 15px 35px -10px ${color}80`
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-lg">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    </svg>
                  </div>
                  <span className="mt-4 text-lg md:text-xl font-bold text-white/90 line-clamp-3 drop-shadow-md px-2">
                    {book.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ডান দিকের ডিটেইলস */}
          <div className="md:col-span-2 flex flex-col pt-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {book.category?.name && (
                <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-400">
                  {book.category.name}
                </span>
              )}
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${book.availableCopies > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                {book.availableCopies} of {book.totalCopies} available
              </span>
            </div>

            <h1 className="mb-3 text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm">{book.title}</h1>
            <p className="mb-8 text-base md:text-lg text-gray-400 font-medium">
              by <span className="text-gray-200">{book.authors?.map((a) => a.name).join(", ") || "Unknown author"}</span>
            </p>

            {/* ডাটা গ্রিড (কালারফুল) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Publisher</dt>
                <dd className="text-sm font-medium text-white">{book.publisher?.name || "—"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Edition</dt>
                <dd className="text-sm font-medium text-white">{book.edition || "—"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">ISBN</dt>
                <dd className="text-sm font-medium text-white">{book.isbn || "—"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Year</dt>
                <dd className="text-sm font-medium text-white">{book.publicationYear || "—"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Language</dt>
                <dd className="text-sm font-medium text-white">{book.language || "—"}</dd>
              </div>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <dt className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Shelf Location</dt>
                <dd className="text-sm font-medium text-white">{book.shelfLocation || "—"}</dd>
              </div>
            </div>

            {/* ডেসক্রিপশন */}
            {book.description && (
              <div className="mb-8 p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  About this book
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-300">{book.description}</p>
              </div>
            )}

            {/* অ্যাকশন বাটন */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mt-auto">
              <Link 
                href={`/reader/request/${book._id}`} 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3.5 md:py-4 font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100 mix-blend-overlay"></span>
                <span className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  Request to Borrow
                </span>
              </Link>
              
              <Link 
                href="/books" 
                className="inline-flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-8 py-3.5 md:py-4 font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
              >
                Browse More
              </Link>
            </div>

            {/* এভেইলেবল কপি আইডি */}
            {availableCopies.length > 0 && (
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs md:text-sm text-gray-400">
                <svg className="text-purple-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <div>
                  <span className="font-semibold text-white">Available on shelf:</span> {availableCopies.map((c) => c.copyId).join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
