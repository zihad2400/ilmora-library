import mongoose from "mongoose";

const STATUS = ["AVAILABLE", "RESERVED", "ISSUED", "DAMAGED", "LOST", "ARCHIVED"];

const bookCopySchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    copyId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: STATUS, default: "AVAILABLE", index: true },
    condition: {
      type: String,
      enum: ["NEW", "GOOD", "FAIR", "POOR"],
      default: "GOOD",
    },
    shelfLocation: { type: String, default: "" },
    notes: { type: String, default: "" },
    currentBorrowRecord: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRecord" },
  },
  { timestamps: true }
);

bookCopySchema.statics.STATUS = STATUS;

export default mongoose.models.BookCopy || mongoose.model("BookCopy", bookCopySchema);
