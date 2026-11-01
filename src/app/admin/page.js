import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import BorrowRequest from "@/models/BorrowRequest";
import BorrowRecord from "@/models/BorrowRecord";
import Link from "next/link";

export const instant = false;

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/reader");

  await connectDB();

  // ডাইনামিক ডাটা (ডাটাবেস থেকে)
  const totalBooks = await Book.countDocuments({ isArchived: false });
  const totalReaders = await User.countDocuments({ role: "READER" });
  const pendingRequests = await BorrowRequest.countDocuments({ status: "PENDING" });
  const activeBorrowings = await BorrowRecord.countDocuments({ status: "ACTIVE" });

  const stats = [
    { label: "Total Books", value: totalBooks, gradient: "from-purple-500 to-indigo-500", icon: "📚" },
    { label: "Total Readers", value: totalReaders, gradient: "from-emerald-400 to-teal-500", icon: "👥" },
    { label: "Pending Requests", value: pendingRequests, gradient: "from-amber-400 to-orange-500", icon: "⏳" },
    { label: "Active Borrowings", value: activeBorrowings, gradient: "from-blue-400 to-cyan-500", icon: "📖" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Welcome back, {session.user.name}!</h1>
        <p className="mt-1 text-sm text-gray-400">Here is the overview of your library today.</p>
      </header>

      {/* স্ট্যাটস গ্রিড */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 group hover:border-white/20 transition-all">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${s.gradient}`}></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{s.label}</p>
                <p className="text-4xl font-black">{s.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} bg-opacity-20 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-bold mb-4">Borrow Requests</h2>
          <p className="text-sm text-gray-400 mb-6">Review reader book requests, approve or reject them. Default due date is 14 days.</p>
          <Link href="/admin/requests" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] inline-block">
            Manage Requests
          </Link>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-bold mb-4">Library Inventory</h2>
          <p className="text-sm text-gray-400 mb-6">Add new books, manage physical copies, and update stock.</p>
          <Link href="/admin/books" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium transition-all border border-white/10 inline-block">
            Manage Books
          </Link>
        </div>
      </div>
    </div>
  );
}
