import Link from "next/link";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import Category from "@/models/Category";
import { connection } from "next/server";
import FooterNewsletter from "./FooterNewsletter";
import FooterSocial from "./FooterSocial";

export default async function Footer() {
  await connection();
  await connectDB();

  const totalBooks = await Book.countDocuments({ isArchived: { $ne: true } });
  const totalReaders = await User.countDocuments({ role: "READER" });

  const categoryData = [
    { name: "Islamic Books", match: ["Islamic Books", "Islamic Education", "Islamic History", "Islamic Literature"], color: "bg-emerald-500", slug: "islamic-books" },
    { name: "Quran & Tafsir", match: ["Quran & Tafsir"], color: "bg-purple-500", slug: "quran-tafsir" },
    { name: "Hadith Books", match: ["Hadith"], color: "bg-pink-500", slug: "hadith" },
    { name: "CSE Books", match: ["CSE Books", "Computer Science"], color: "bg-cyan-500", slug: "cse-books" },
    { name: "Programming", match: ["Programming", "Web Development", "Database Management", "Software Engineering"], color: "bg-blue-500", slug: "programming" },
    { name: "Mathematics", match: ["Mathematics"], color: "bg-red-500", slug: "mathematics" },
  ];

  const categoriesWithCount = await Promise.all(categoryData.map(async (cat) => {
    const cats = await Category.find({ name: { $in: cat.match } }).select("_id");
    const count = await Book.countDocuments({ category: { $in: cats.map(c => c._id) }, isArchived: { $ne: true } });
    return { ...cat, count: `${count}+` };
  }));

  return (
    <footer className="relative bg-[#050812] text-white pt-24 md:pt-32 mt-20 overflow-hidden font-sans border-t border-white/10">
      
      {/* উপরের কার্ভ */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="#0b1021" />
          <path d="M0,0 C300,120 900,120 1200,0" fill="none" stroke="url(#neonGrad)" strokeWidth="4" />
          <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* মেইন কন্টেইনার */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 pt-8 pb-8">
        
        {/* গ্রিড লেআউট */}
        <div className="flex flex-col gap-10 lg:gap-8 mb-12">
          
          {/* উপরের ৪টি সেকশন (মোবাইলে ২টি রো) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 text-center sm:text-left">
            
            {/* ১. Quick Links */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center justify-center sm:justify-start gap-2 w-full">
                <span className="text-cyan-400 text-lg md:text-xl">🔗</span> Quick Links
              </h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400 flex flex-col items-center sm:items-start w-full">
                {[
                  { name: "Home", href: "/" },
                  { name: "All Books", href: "/books" },
                  { name: "Islamic Books", href: "/books?category=islamic-books" },
                  { name: "CSE Books", href: "/books?category=cse-books" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact Us", href: "/contact" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="flex items-center justify-center sm:justify-start gap-2 hover:text-white transition-colors group">
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">❯</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ২. Book Categories */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center justify-center sm:justify-start gap-2 w-full">
                <span className="text-purple-400 text-lg md:text-xl">📖</span> Book Categories
              </h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400 w-full max-w-[200px]">
                {categoriesWithCount.map((cat, i) => (
                  <li key={i}>
                    <Link href={`/books?category=${cat.slug}`} className="flex items-center justify-between group w-full">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className={`h-3 w-3 md:h-4 md:w-4 rounded flex items-center justify-center text-[8px] md:text-[10px] text-white ${cat.color}`}>📚</span>
                        <span className="group-hover:text-white transition-colors truncate max-w-[80px] sm:max-w-full">{cat.name}</span>
                      </div>
                      <span className="bg-white/10 text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ৩. Contact Us */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center justify-center sm:justify-start gap-2 w-full">
                <span className="text-cyan-400 text-lg md:text-xl">🎧</span> Contact Us
              </h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400 flex flex-col items-center sm:items-start">
                <li className="flex items-start gap-2 hover:text-white transition-colors text-center sm:text-left">
                  <span className="text-emerald-400 mt-0.5">📍</span>
                  <span className="max-w-[140px] sm:max-w-none">123 Knowledge Street, Dhaka, Bangladesh</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-emerald-400">📞</span>
                  <a href="tel:+8801234567890">+880 1234 567890</a>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-emerald-400">✉️</span>
                  <a href="mailto:info@ilmora.com">info@ilmora.com</a>
                </li>
                <li className="flex items-start gap-2 text-center sm:text-left">
                  <span className="text-emerald-400 mt-0.5">🕒</span>
                  <span className="max-w-[140px] sm:max-w-none">Mon - Sun: 8:00 AM - 10:00 PM</span>
                </li>
              </ul>
            </div>

            {/* ৪. Newsletter */}
            <div className="flex flex-col items-center sm:items-start w-full">
              <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center justify-center sm:justify-start gap-2 w-full">
                <span className="text-purple-400 text-lg md:text-xl">📧</span> Newsletter
              </h3>
              <div className="w-full max-w-[200px] sm:max-w-[280px]">
                <p className="text-[10px] md:text-xs text-gray-400 mb-3 text-center sm:text-left">Get the latest updates about new books.</p>
                <FooterNewsletter />
              </div>
            </div>

          </div>

          {/* নিচের সেকশন: লোগো ও বর্ণনা (মাঝখানে) */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 border-t border-white/10 pt-8 mt-4">
            <Link href="/" className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-black tracking-tight text-white">ILMORA</div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase">Knowledge, Discovery & Learning</div>
              </div>
            </Link>
            
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
              ILMORA is a modern Islamic & Educational Digital Library, dedicated to spread knowledge, build a better future and inspire lifelong learning.
            </p>

            <div className="flex justify-center pt-2">
              <FooterSocial />
            </div>
          </div>

        </div>

        {/* নিচের কপিরাইট বার */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-gray-400 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">🛡️</span>
            <span>© 2026 ILMORA. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with <span className="text-red-500 animate-pulse">❤️</span> for Knowledge</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
