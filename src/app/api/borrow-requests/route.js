import { z } from "zod";
import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import Book from "@/models/Book";
import BookCopy from "@/models/BookCopy";
import BorrowRecord from "@/models/BorrowRecord";
import LibrarySettings from "@/models/LibrarySettings";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { requireUser } from "@/lib/session";
import { ok, fail, handleError } from "@/lib/api";

const schema = z.object({
  bookId: z.string().min(1),
});

export async function POST(req) {
  try {
    const user = await requireUser();
    if (user.role !== "READER") return fail("Only readers can request books.", 403);

    await connectDB();
    const body = await req.json();
    const { bookId } = schema.parse(body);

    const book = await Book.findById(bookId);
    if (!book || book.isArchived) return fail("Book not found or archived.", 404);

    let settings = await LibrarySettings.findOne({ key: "GLOBAL" });
    const maxBooks = settings ? settings.maxBooksPerReader : 5;

    const activeBorrows = await BorrowRecord.countDocuments({ reader: user.id, status: "ACTIVE" });
    if (activeBorrows >= maxBooks) {
      return fail(`You have reached the maximum limit of ${maxBooks} active borrowed books.`, 400);
    }

    const existingRequest = await BorrowRequest.findOne({ 
      reader: user.id, 
      book: bookId, 
      status: "PENDING" 
    });
    if (existingRequest) return fail("You already have a pending request for this book.", 400);

    if (book.availableCopies <= 0) {
      return fail("No physical copies are currently available for this book.", 400);
    }

    const borrowRequest = await BorrowRequest.create({
      reader: user.id,
      book: bookId,
      status: "PENDING",
      requestDate: new Date(),
    });

    // অ্যাডমিনকে নোটিফিকেশন পাঠানো
    const admin = await User.findOne({ role: "SUPERADMIN" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        type: "NEW_REQUEST",
        title: "New Borrow Request",
        message: `${user.name} requested to borrow "${book.title}".`,
        link: "/admin/requests",
      });
    }

    return ok({ message: "Request submitted successfully.", requestId: borrowRequest._id }, 201);
  } catch (err) {
    return handleError(err);
  }
}
