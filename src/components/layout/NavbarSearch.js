"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ESC চাপলে বন্ধ হবে
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* সার্চ আইকন বাটন */}
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>

      {/* সার্চ মডাল */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0d1224] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSearch} className="flex items-center p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 text-gray-400" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                autoFocus
                type="text" 
                placeholder="Search for books, authors, categories..." 
                className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-gray-500 text-lg py-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Search
              </button>
            </form>
            <div className="bg-white/5 px-4 py-2 text-xs text-gray-500 border-t border-white/5">
              Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">ESC</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
