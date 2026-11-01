import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Author from "@/models/Author";
import Category from "@/models/Category";
import { connection } from "next/server"; // <-- Next.js 16 ডাইনামিক রেন্ডারিং ফিক্স

export const instant = false;

export default async function AdminBooksPage() {
  // Next.js-কে রিকোয়েস্ট টাইমে ডাটা আনতে বাধ্য করা
  await connection();
  
  await connectDB();
  
  const books = await Book.find({})
    .populate("authors", "name")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Book Inventory</h1>
          <p className="text-sm text-gray-400">Total {books.length} books in the database.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">ISBN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{book.title}</td>
                <td className="px-6 py-4 text-gray-400">{book.authors?.map((a) => a.name).join(", ") || "—"}</td>
                <td className="px-6 py-4 text-gray-400">{book.category?.name || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${book.availableCopies > 0 ? 'badge-green' : 'badge-red'}`}>
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{book.isbn || "—"}</td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No books found. Please run the seed script.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
