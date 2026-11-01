import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Link from "next/link";

export const instant = false;

export default async function AdminReadersPage() {
  await connectDB();
  const readers = await User.find({ role: "READER" }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Reader Management</h1>
          <p className="text-sm text-gray-400">Total {readers.length} registered readers.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Reader ID</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {readers.map((r) => (
              <tr key={r._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{r.fullName}</td>
                <td className="px-6 py-4 text-purple-400">{r.readerId}</td>
                <td className="px-6 py-4 text-gray-400">{r.email}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${r.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {readers.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No readers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
