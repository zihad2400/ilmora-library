import Link from "next/link";
import HomeHeader from "@/components/layout/HomeHeader";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import Category from "@/models/Category";
import { connection } from "next/server";

export const instant = false;

export default async function HomePage() {
  await connection();
  await connectDB();

  // ডাইনামিক ডাটা
  const totalBooks = await Book.countDocuments({ isArchived: { $ne: true } });
  const totalReaders = await User.countDocuments({ role: "READER" });
  
  // ক্যাটাগরি সেকশনের জন্য ডাটা
  const categoryData = [
    { name: "Islamic Books", slug: "islamic-books", icon: "🕌", color: "from-emerald-900/40 to-emerald-900/10 border-emerald-500/20 hover:border-emerald-400", iconColor: "text-emerald-400", match: ["Islamic Books", "Islamic Education", "Islamic History", "Islamic Literature"] },
    { name: "Quran & Tafsir", slug: "quran-tafsir", icon: "📖", color: "from-purple-900/40 to-purple-900/10 border-purple-500/20 hover:border-purple-400", iconColor: "text-purple-400", match: ["Quran & Tafsir"] },
    { name: "Hadith Books", slug: "hadith", icon: "📜", color: "from-amber-900/40 to-amber-900/10 border-amber-500/20 hover:border-amber-400", iconColor: "text-amber-400", match: ["Hadith"] },
    { name: "CSE Books", slug: "cse-books", icon: "💻", color: "from-cyan-900/40 to-cyan-900/10 border-cyan-500/20 hover:border-cyan-400", iconColor: "text-cyan-400", match: ["CSE Books", "Computer Science"] },
    { name: "Programming", slug: "programming", icon: "⌨️", color: "from-blue-900/40 to-blue-900/10 border-blue-500/20 hover:border-blue-400", iconColor: "text-blue-400", match: ["Programming", "Web Development", "Database Management", "Software Engineering"] },
    { name: "View All", slug: "", icon: "📚", color: "from-gray-800/40 to-gray-900/10 border-gray-600/20 hover:border-gray-400", iconColor: "text-gray-400", match: [] },
  ];

  const categoriesWithCount = await Promise.all(categoryData.map(async (cat) => {
    if (cat.match.length === 0) return { ...cat, count: "Categories" };
    const cats = await Category.find({ name: { $in: cat.match } }).select("_id");
    const count = await Book.countDocuments({ category: { $in: cats.map(c => c._id) }, isArchived: { $ne: true } });
    return { ...cat, count: `+${count} Books` };
  }));

  const featuredBooks = await Book.find({ isArchived: { $ne: true } })
    .populate("authors", "name")
    .populate("category", "name color")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return (
    <main className="min-h-screen bg-[#050812] text-white overflow-hidden font-sans">
      <HomeHeader />

      {/* হিরো সেকশন */}
      <section className="relative mx-auto max-w-[1400px] px-4 pt-6 pb-12">
        <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]"></div>
        <div className="absolute top-20 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/20 blur-[120px]"></div>

        <div className="relative z-10 flex flex-col bg-gradient-to-r from-[#0b1021] to-[#0f152e] rounded-[2rem] border border-white/10 shadow-2xl">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center overflow-hidden rounded-[2rem]">
            <div className="lg:col-span-6 p-10 lg:p-14 lg:pr-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300 mb-6">
                <span className="text-yellow-400">★</span>
                Welcome to ILMORA Library
              </div>
              
              <h1 className="text-5xl lg:text-[5rem] font-black leading-[1.05] tracking-tight mb-4 text-white">
                ILMORA<br />
                <span className="text-4xl lg:text-5xl text-gray-200 mt-2 block">A World of </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Knowledge</span>
              </h1>
              
              <p className="text-base text-gray-400 mb-8 max-w-md leading-relaxed mt-6">
                Explore. Read. Learn. Grow. Your premium Islamic & Educational library, bringing knowledge closer to you with a modern and smart library experience.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/books" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all flex items-center gap-2">
                  Explore Books
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-full min-h-[450px] hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0b1021]/50 to-[#0b1021] z-10 w-1/4 left-0"></div>
              
              <div className="absolute top-12 right-12 text-right z-20">
                <h2 className="text-4xl text-white font-arabic mb-2 drop-shadow-lg">اقْرَأْ بِاسْمِ رَبِّكَ</h2>
                <p className="text-sm text-gray-300">"Read, in the name of your Lord"</p>
                <p className="text-xs text-gray-500 mt-1">— Quran 96:1</p>
              </div>

              <div className="absolute bottom-0 w-full h-[85%] flex items-end justify-center opacity-90">
                <svg viewBox="0 0 400 300" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="mosqueBody" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4c1d95" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#4c1d95" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <rect x="60" y="100" width="24" height="200" fill="#1e1b4b" rx="4" />
                  <path d="M60,100 L72,70 L84,100 Z" fill="#4c1d95" />
                  <rect x="316" y="100" width="24" height="200" fill="#1e1b4b" rx="4" />
                  <path d="M316,100 L328,70 L340,100 Z" fill="#4c1d95" />
                  <rect x="110" y="180" width="180" height="120" fill="url(#mosqueBody)" rx="8" />
                  <path d="M140,180 Q200,50 260,180 Z" fill="url(#domeGrad)" filter="url(#glow)" />
                  <path d="M160,180 Q200,90 240,180 Z" fill="#a78bfa" opacity="0.6" />
                  <path d="M90,180 Q110,140 130,180 Z" fill="url(#domeGrad)" />
                  <path d="M270,180 Q290,140 310,180 Z" fill="url(#domeGrad)" />
                  <rect x="180" y="220" width="40" height="80" fill="#020617" rx="20" />
                  <path d="M200,40 A15,15 0 1,1 200,70 A12,12 0 1,0 200,40 Z" fill="#fbbf24" filter="url(#glow)" />
                  <rect x="130" y="200" width="15" height="30" fill="#fbbf24" opacity="0.3" rx="7" />
                  <rect x="255" y="200" width="15" height="30" fill="#fbbf24" opacity="0.3" rx="7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ক্যাটাগরি সেকশন */}
      <section className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithCount.map((cat, i) => (
            <Link key={i} href={`/books?category=${cat.slug}`} className={`group flex items-center gap-3 p-4 rounded-2xl border bg-gradient-to-br ${cat.color} transition-all duration-300 hover:-translate-y-1`}>
              <div className={`text-2xl ${cat.iconColor} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">{cat.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{cat.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* স্ট্যাটস সেকশন */}
      <section className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 rounded-2xl bg-[#0d1224] border border-white/5">
          {[
            { icon: "📚", val: `${totalBooks}+`, text: "Total Books", color: "text-emerald-400" },
            { icon: "👥", val: `${totalReaders}+`, text: "Happy Readers", color: "text-cyan-400" },
            { icon: "🔄", val: "3.5K+", text: "Borrowed Books", color: "text-purple-400" },
            { icon: "⭐", val: "98%", text: "Satisfaction Rate", color: "text-amber-400" },
            { icon: "🏆", val: "24/7", text: "Library Access", color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 justify-center md:justify-start border-r border-white/5 last:border-0">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <div className={`text-xl font-black ${stat.color} leading-none mb-1`}>{stat.val}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{stat.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ফিচার্ড বুক ও নিউজ সেকশন */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* ফিচার্ড বুক সেকশন */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-yellow-400">★</span> Featured Books
              </h2>
              <p className="text-xs text-gray-400 mt-1">Discover our most popular and recommended books</p>
            </div>
            <Link href="/books" className="bg-white/5 border border-white/10 text-white text-xs px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
              View All Books →
            </Link>
          </div>

          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {featuredBooks.map((book) => {
                // ক্যাটাগরি অনুযায়ী কালার ও আইকন
                const isIslamic = book.category?.name?.toLowerCase().includes("islamic") || 
                                  book.category?.name?.toLowerCase().includes("quran") || 
                                  book.category?.name?.toLowerCase().includes("hadith") || 
                                  book.category?.name?.toLowerCase().includes("tafsir");
                
                const catColor = isIslamic ? "from-emerald-900/80 to-[#0f172a]" : "from-purple-900/80 to-[#0f172a]";
                const glowColor = isIslamic ? "bg-emerald-500/30" : "bg-purple-500/30";
                const badgeColor = isIslamic ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-purple-500/20 text-purple-300 border-purple-500/30";

                return (
                  <Link href={`/books/${book._id}`} key={book._id} className="flex flex-col group cursor-pointer">
                    <div className={`relative aspect-[3/4] rounded-xl overflow-hidden mb-2 border border-white/10 shadow-lg group-hover:border-white/30 transition-all duration-300 bg-gradient-to-br ${catColor}`}>
                      {/* গ্লো ইফেক্ট */}
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-500 ${glowColor}`}></div>
                      
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                          </div>
                          <div className="text-[10px] font-bold text-white line-clamp-3 leading-tight">{book.title}</div>
                        </div>
                      )}
                      
                      {/* ক্যাটাগরি ব্যাজ */}
                      <div className={`absolute top-2 left-2 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold border uppercase z-20 ${badgeColor}`}>
                        {book.category?.name || "Book"}
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">{book.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{book.authors?.[0]?.name || "Unknown"}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No featured books available yet.</p>
          )}
        </div>

        {/* নিউজ আপডেট সেকশন */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0d1224] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span className="text-purple-400">📢</span> Library News & Updates
              </h2>
              <Link href="#" className="text-[10px] text-purple-400 hover:underline">View All →</Link>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: "📚", title: "New Islamic Books Added", desc: "Explore 200+ new Islamic books!", date: "Apr 25, 2025", color: "bg-emerald-500/20 text-emerald-400" },
                { icon: "💻", title: "CSE Collection Updated", desc: "New programming books available!", date: "Apr 20, 2025", color: "bg-blue-500/20 text-blue-400" },
                { icon: "⚙️", title: "Library Maintenance", desc: "Scheduled on Apr 30, 2025", date: "Apr 18, 2025", color: "bg-red-500/20 text-red-400" }
              ].map((news, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className={`h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center ${news.color}`}>
                    {news.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{news.title}</h4>
                    <p className="text-[10px] text-gray-500 truncate">{news.desc}</p>
                  </div>
                  <div className="text-[9px] text-gray-500 whitespace-nowrap">{news.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* জয়েন কার্ড */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between">
             <div>
               <h3 className="text-sm font-bold text-white mb-1">Join ILMORA Today!</h3>
               <p className="text-[10px] text-gray-400">Get the best library experience</p>
             </div>
             <Link href="/register" className="bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
               Register Now
             </Link>
          </div>
        </div>

      </section>

    </main>
  );
}
