import { connectDB } from "@/lib/db";
import BorrowRecord from "@/models/BorrowRecord";
import { connection } from "next/server";

export const instant = false;

export default async function AdminIssuedBooksPage() {
  await connection();
  await connectDB();

  const records = await BorrowRecord.find({})
    .populate("reader", "fullName readerId")
    .populate("book", "title")
    .populate("bookCopy", "copyId")
    .sort({ issueDate: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Issued Books</h1>
          <p className="text-sm text-gray-400">Track all currently issued and returned books.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Reader</th>
              <th className="px-6 py-4 font-medium">Book</th>
              <th className="px-6 py-4 font-medium">Copy ID</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((rec) => {
              const isOverdue = rec.status === 'ACTIVE' && new Date(rec.dueDate) < new Date();
              return (
                <tr key={rec._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{rec.reader?.fullName}</div>
                    <div className="text-xs text-gray-400">{rec.reader?.readerId}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{rec.book?.title}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{rec.bookCopy?.copyId}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(rec.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      rec.status === 'RETURNED' ? 'badge-green' : 
                      isOverdue ? 'badge-red' : 'badge-blue'
                    }`}>
                      {isOverdue ? 'OVERDUE' : rec.status}
                    </span>
                  </td>
                </tr>
              )
            })}
            {records.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No issued books found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
