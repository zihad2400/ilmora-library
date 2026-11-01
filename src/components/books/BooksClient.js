"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "./BookCard";

export default function BooksClient({ initialBooks, categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [availability, setAvailability] = useState(searchParams.get("availability") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/books?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (q !== (searchParams.get("q") || "")) {
        updateURL({ q });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  const handleReset = () => {
    setQ("");
    setCategory("");
    setAvailability("");
    setSort("newest");
    router.push("/books");
  };

  const hasFilters = q || category || availability || sort !== "newest";

  return (
    <div className="w-full">
      {/* প্রিমিয়াম ফিল্টার বার */}
      <div className="mb-8 p-1.5 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="bg-[#0a0e1a]/90 rounded-[1.25rem] p-4 sm:p-5">
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                placeholder="Search books..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-500"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[60%]">
              {/* ড্রপডাউনগুলো */}
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); updateURL({ category: e.target.value }); }}
                >
                  <option value="" className="bg-[#0a0e1a]">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug} className="bg-[#0a0e1a]">{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              <div className="relative">
                <select
                  className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 pr-10 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                  value={availability}
                  onChange={(e) => { setAvailability(e.target.value); updateURL({ availability: e.target.value }); }}
                >
                  <option value="" className="bg-[#0a0e1a]">Any Availability</option>
                  <option value="available" className="bg-[#0a0e1a]">Available Now</option>
                  <option value="borrowed" className="bg-[#0a0e1a]">Currently Borrowed</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              <div className="relative">
                <select
                  className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 pr-10 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); updateURL({ sort: e.target.value }); }}
                >
                  <option value="newest" className="bg-[#0a0e1a]">Newest First</option>
                  <option value="oldest" className="bg-[#0a0e1a]">Oldest First</option>
                  <option value="title" className="bg-[#0a0e1a]">Title A–Z</option>
                  <option value="popular" className="bg-[#0a0e1a]">Most Available</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end animate-in fade-in slide-in-from-top-2 duration-300">
              <button 
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {!initialBooks || initialBooks.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">No books found</h3>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialBooks.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
