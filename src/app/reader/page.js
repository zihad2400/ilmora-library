import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import BorrowRecord from "@/models/BorrowRecord";
import User from "@/models/User";
import Link from "next/link";

export const instant = false;

export default async function ReaderDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "READER") redirect("/admin");

  await connectDB();

  // রিডারের ডাটাবেস রেকর্ড
  const user = await User.findById(session.user.id).lean();
  
  // ডাইনামিক পরিসংখ্যান
  const pendingRequests = await BorrowRequest.countDocuments({ reader: user._id, status: "PENDING" });
  const activeBorrows = await BorrowRecord.countDocuments({ reader: user._id, status: "ACTIVE" });
  const returnedBooks = await BorrowRecord.countDocuments({ reader: user._id, status: "RETURNED" });
  const totalRequests = await BorrowRequest.countDocuments({ reader: user._id });

  const stats = [
    { label: "Active Borrows", value: activeBorrows, color: "#10b981", icon: "📖" },
    { label: "Pending Requests", value: pendingRequests, color: "#f59e0b", icon: "⏳" },
    { label: "Books Returned", value: returnedBooks, color: "#3b82f6", icon: "✅" },
    { label: "Total Requests", value: totalRequests, color: "#8b5cf6", icon: "📝" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 relative">
      {/* ইউজার প্রোফাইল হেডার */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Welcome, {user.fullName}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
              <span className="badge badge-blue">Reader ID: {user.readerId}</span>
              <span>Member since {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
        <Link href="/books" className="btn-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]">
          Browse Books
        </Link>
      </header>

      {/* স্ট্যাটস গ্রিড */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="card relative overflow-hidden group hover:border-white/20 transition-all bg-white/5 border-white/10">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: s.color }}></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--il-muted)" }}>
                  {s.label}
                </p>
                <p className="text-4xl font-black">{s.value}</p>
              </div>
              <div className="text-3xl opacity-80 group-hover:scale-110 transition-transform">{s.icon}</div>
            </div>
          </div>
        ))}
      </section>

      {/* কুইক লিংকস */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card bg-gradient-to-br from-purple-900/30 to-black border-purple-500/20 hover:border-purple-500/50 transition-all">
          <h2 className="text-xl font-bold mb-2">My Borrow Requests</h2>
          <p className="text-sm mb-6" style={{ color: "var(--il-muted)" }}>
            Track your book requests. Remember, all requests require Admin approval within 14 days.
          </p>
          <Link href="/reader/requests" className="btn-primary">
            View My Requests
          </Link>
        </div>

        <div className="card bg-white/5 border-white/10 hover:border-white/20 transition-all">
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <p className="text-sm mb-6" style={{ color: "var(--il-muted)" }}>
            Update your personal information and address.
          </p>
          <button className="btn-ghost opacity-50 cursor-not-allowed">
            Edit Profile (Coming Soon)
          </button>
        </div>
      </section>
    </main>
  );
}
