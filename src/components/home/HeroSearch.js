"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/books`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-[#0d1224]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-purple-500/50 focus-within:border-purple-500/80">
      <svg xmlns="http://www.w3.org/2000/svg" className="ml-4 text-gray-400" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input 
        type="text" 
        placeholder="Search for books... (Title, Author, ISBN, Category)" 
        className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-gray-500 text-sm py-3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit" 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}
