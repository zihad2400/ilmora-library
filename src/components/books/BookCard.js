import Link from "next/link";

export default function BookCard({ book }) {
  const authorNames = book.authors?.map((a) => a.name).join(", ") || "Unknown author";
  const available = book?.availableCopies || 0;
  const total = book?.totalCopies || 0;
  
  // ক্যাটাগরি চেক
  const isIslamic = book.category?.name?.toLowerCase().includes("islamic") || 
                    book.category?.name?.toLowerCase().includes("quran") || 
                    book.category?.name?.toLowerCase().includes("hadith") || 
                    book.category?.name?.toLowerCase().includes("tafsir") || 
                    book.category?.name?.toLowerCase().includes("history") || 
                    book.category?.name?.toLowerCase().includes("literature") || 
                    book.category?.name?.toLowerCase().includes("education");
  
  const isCSE = !isIslamic && (
                book.category?.name?.toLowerCase().includes("cse") || 
                book.category?.name?.toLowerCase().includes("programming") || 
                book.category?.name?.toLowerCase().includes("computer") || 
                book.category?.name?.toLowerCase().includes("web") || 
                book.category?.name?.toLowerCase().includes("database") || 
                book.category?.name?.toLowerCase().includes("software")
                );

  // ১০০% কালারফুল থিম
  const theme = {
    islamic: {
      color: "#34d399", // Neon Emerald
      bg: "bg-gradient-to-br from-emerald-500/20 via-teal-900/30 to-[#0a0e1a]",
      border: "border-emerald-500/30 hover:border-emerald-400",
      shadow: "hover:shadow-[0_15px_40px_-10px_rgba(52,211,153,0.5)]",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      textHover: "group-hover:text-emerald-400"
    },
    cse: {
      color: "#c084fc", // Neon Purple
      bg: "bg-gradient-to-br from-purple-500/20 via-indigo-900/30 to-[#0a0e1a]",
      border: "border-purple-500/30 hover:border-purple-400",
      shadow: "hover:shadow-[0_15px_40px_-10px_rgba(192,132,252,0.5)]",
      iconBg: "bg-gradient-to-br from-purple-400 to-indigo-600",
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
      textHover: "group-hover:text-purple-400"
    },
    default: {
      color: "#60a5fa", // Neon Blue
      bg: "bg-gradient-to-br from-blue-500/20 via-slate-900/30 to-[#0a0e1a]",
      border: "border-blue-500/30 hover:border-blue-400",
      shadow: "hover:shadow-[0_15px_40px_-10px_rgba(96,165,250,0.5)]",
      iconBg: "bg-gradient-to-br from-blue-400 to-cyan-600",
      badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      textHover: "group-hover:text-blue-400"
    }
  };

  const currentTheme = isIslamic ? theme.islamic : (isCSE ? theme.cse : theme.default);

  return (
    <Link 
      href={`/books/${book._id}`} 
      className={`group relative flex flex-col overflow-hidden rounded-3xl border ${currentTheme.border} ${currentTheme.bg} transition-all duration-500 hover:-translate-y-2 ${currentTheme.shadow}`}
    >
      {/* ব্যাকগ্রাউন্ড নিয়ন গ্লো */}
      <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px]" style={{ backgroundColor: currentTheme.color, opacity: 0.3 }}></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px]" style={{ backgroundColor: currentTheme.color, opacity: 0.2 }}></div>
      </div>

      {/* প্যাটার্ন */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

      {/* উপরের সেকশন (আইকন) */}
      <div className="relative flex h-44 items-center justify-center p-6 z-10">
        <div className="relative flex flex-col items-center justify-center">
          <div 
            className={`relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 ${currentTheme.iconBg}`}
            style={{ boxShadow: `0 10px 30px -10px ${currentTheme.color}90` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              <path d="M8 7h8" className="opacity-70"/>
              <path d="M8 11h8" className="opacity-70"/>
              <path d="M8 15h5" className="opacity-70"/>
            </svg>
          </div>
        </div>
        
        {/* স্টক ব্যাজ */}
        <div className="absolute top-4 right-4 z-20">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border ${currentTheme.badgeBg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${available > 0 ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></span>
            {available > 0 ? `${available} In Stock` : "Unavailable"}
          </span>
        </div>
      </div>

      {/* নিচের সেকশন (টেক্সট) */}
      <div className="relative flex flex-1 flex-col p-5 z-10 bg-[#0a0e1a]/60 backdrop-blur-sm border-t border-white/5">
        
        {/* ক্যাটাগরি */}
        <div className="mb-3">
          <span 
            className="inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border"
            style={{ background: `${currentTheme.color}20`, color: currentTheme.color, borderColor: `${currentTheme.color}40` }}
          >
            {book.category?.name || "General"}
          </span>
        </div>
        
        {/* টাইটেল */}
        <h3 className={`line-clamp-2 text-lg font-bold text-white leading-tight mb-2 transition-colors duration-300 ${currentTheme.textHover}`}>
          {book.title}
        </h3>
        
        {/* লেখক */}
        <p className="text-xs font-medium text-gray-300 mb-5 flex items-center gap-1.5 line-clamp-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: currentTheme.color }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {authorNames}
        </p>

        {/* ফুটার */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            {total} {total === 1 ? "Copy" : "Copies"}
          </div>
          
          <div 
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/10 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/20`}
            style={{ color: currentTheme.color }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
