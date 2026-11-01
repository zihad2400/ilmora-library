import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import BookCopy from "@/models/BookCopy";
import { ok, fail, handleError } from "@/lib/api";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const book = await Book.findById(id)
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("category", "name slug color")
      .lean();

    if (!book || book.isArchived) return fail("Book not found", 404);

    const availableCopies = await BookCopy.find({ book: id, status: "AVAILABLE" })
      .select("copyId shelfLocation condition")
      .lean();

    return ok({ book, availableCopies });
  } catch (err) {
    return handleError(err);
  }
}
