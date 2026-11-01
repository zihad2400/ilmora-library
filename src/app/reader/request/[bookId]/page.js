import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RequestForm from "@/components/books/RequestForm";
import Link from "next/link";
import PublicNav from "@/components/layout/PublicNav";

export const instant = false;

export default async function RequestPage({ params }) {
  const { bookId } = await params;
  const session = await auth();
  
  if (!session?.user) redirect("/login");
  if (session.user.role !== "READER") redirect("/admin");

  await connectDB();
  const book = await Book.findById(bookId).populate("authors", "name").lean();
  
  if (!book) return notFound();

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-lg px-6 py-16">
        <div className="card bg-white/5 border-white/10">
          <h1 className="text-2xl font-bold mb-2">Request to Borrow</h1>
          <p className="text-sm text-gray-400 mb-6">
            You are about to request this book. All requests require admin approval.
          </p>

          <div className="mb-6 p-4 rounded-xl bg-black/30 border border-white/10 flex gap-4 items-center">
            <div className="h-16 w-12 bg-purple-600/20 rounded flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-white line-clamp-1">{book.title}</h3>
              <p className="text-xs text-gray-400">{book.authors?.map(a => a.name).join(", ")}</p>
              <p className="text-xs text-emerald-400 mt-1">{book.availableCopies} copies available</p>
            </div>
          </div>

          <RequestForm bookId={book._id.toString()} />

          <div className="mt-6 text-center">
            <Link href={`/books/${book._id}`} className="text-sm text-gray-500 hover:text-white transition-colors">
              Cancel and go back
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
