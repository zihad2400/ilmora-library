import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import Link from "next/link";
import { connection } from "next/server";

export const instant = false;

export default async function MyRequestsPage({ searchParams }) {
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "READER") redirect("/admin");

  await connectDB();
  const params = await searchParams;
  const showSuccess = params.success === "true";

  const requests = await BorrowRequest.find({ reader: session.user.id })
    .populate("book", "title category")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">My Borrow Requests</h1>
          <p className="text-sm text-gray-400">Track your pending, approved, and rejected requests.</p>
        </div>
        <Link href="/books" className="btn-primary text-sm">
          + New Request
        </Link>
      </div>

      {showSuccess && (
        <div className="success-box mb-6 animate-pulse">
          ✅ Request submitted successfully! Please wait for admin approval.
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card bg-white/5 border-white/10 text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold mb-2">No requests yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            You haven't requested any books. Browse our collection and click "Request to Borrow" to get started.
          </p>
          <Link href="/books" className="btn-primary">
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Book</th>
                <th className="px-6 py-4 font-medium">Request Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{req.book?.title}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      req.status === 'PENDING' ? 'badge-amber' : 
                      req.status === 'APPROVED' ? 'badge-green' : 'badge-red'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
