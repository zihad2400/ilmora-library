import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import Book from "@/models/Book";
import BookCopy from "@/models/BookCopy";
import BorrowRecord from "@/models/BorrowRecord";
import LibrarySettings from "@/models/LibrarySettings";
import Notification from "@/models/Notification";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleError } from "@/lib/api";

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const { id } = await params;

    const request = await BorrowRequest.findById(id);
    if (!request) return fail("Request not found", 404);
    if (request.status !== "PENDING") return fail("Request is already processed", 400);

    const copy = await BookCopy.findOneAndUpdate(
      { book: request.book, status: "AVAILABLE" },
      { $set: { status: "ISSUED" } },
      { new: true }
    );

    if (!copy) return fail("No physical copies available in stock.", 400);

    let settings = await LibrarySettings.findOne({ key: "GLOBAL" });
    const borrowDays = settings ? settings.defaultBorrowDays : 14;
    
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const record = await BorrowRecord.create({
      reader: request.reader,
      book: request.book,
      bookCopy: copy._id,
      request: request._id,
      issuedBy: admin.id,
      issueDate,
      dueDate,
      status: "ACTIVE"
    });

    copy.currentBorrowRecord = record._id;
    await copy.save();

    request.status = "APPROVED";
    request.borrowRecord = record._id;
    request.reviewedBy = admin.id;
    request.reviewedAt = new Date();
    await request.save();

    await Book.updateOne({ _id: request.book }, { $inc: { availableCopies: -1 } });

    await Notification.create({
      user: request.reader,
      type: "BORROW_APPROVED",
      title: "Request Approved",
      message: `Your request has been approved. Due date is ${dueDate.toLocaleDateString()}.`,
      link: "/reader/requests"
    });

    return ok({ message: "Request approved successfully!" });
  } catch (err) {
    return handleError(err);
  }
}
