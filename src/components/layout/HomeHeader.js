"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import NavbarSearch from "./NavbarSearch";
import NotificationBell from "../ui/NotificationBell";
import { useState } from "react";

export default function HomeHeader() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050812]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-[1400px] px-4 h-[72px] flex items-center justify-between">
        
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black tracking-tight leading-none text-white">ILMORA</div>
            <div className="text-[8px] sm:text-[9px] text-gray-400 font-medium tracking-widest uppercase mt-0.5 hidden sm:block">Knowledge, Discovery & Learning</div>
          </div>
        </Link>
        
        {/* ডেস্কটপ নেভিগেশন */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow-lg">
            Home
          </Link>
          <Link href="/books" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">All Books</Link>
          <Link href="/books?category=islamic-books" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
            Islamic Books
          </Link>
          <Link href="/books?category=cse-books" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
            CSE Books
          </Link>
          <Link href="/about" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">About</Link>
          <Link href="/contact" className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">Contact</Link>
        </nav>
        
        {/* অ্যাকশন বাটন */}
        <div className="flex items-center gap-1 sm:gap-3">
          <NavbarSearch />
          
          {/* ডেস্কটপে বেল আইকন */}
          {status === "authenticated" && (
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          )}
          
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-white/10"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="hidden md:block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
              {/* মোবাইলে ড্যাশবোর্ড আইকন */}
              <Link href="/dashboard" className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:block bg-white/5 border border-white/10 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors">Login</Link>
              <Link href="/register" className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-xs sm:text-sm font-bold px-3 sm:px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:opacity-90 transition-opacity">Register</Link>
            </>
          )}

          {/* মোবাইল মেনু বাটন */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-300 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0b1021] px-4 py-4 space-y-2 absolute w-full shadow-2xl">
          
          {/* মোবাইলে নোটিফিকেশন (মেনুর ভেতরে) */}
          {status === "authenticated" && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 mb-2 border border-white/10">
              <span className="text-sm font-medium text-white">Notifications</span>
              <NotificationBell />
            </div>
          )}

          {[
            { href: "/", label: "Home" },
            { href: "/books", label: "All Books" },
            { href: "/books?category=islamic-books", label: "Islamic Books" },
            { href: "/books?category=cse-books", label: "CSE Books" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
