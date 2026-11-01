import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    bookCopy: { type: mongoose.Schema.Types.ObjectId, ref: "BookCopy", required: true, index: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRequest" },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true, index: true },
    returnDate: { type: Date },
    returnedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["ACTIVE", "RETURNED", "OVERDUE", "LOST", "DAMAGED"],
      default: "ACTIVE",
      index: true,
    },
    returnCondition: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.BorrowRecord || mongoose.model("BorrowRecord", borrowRecordSchema);
