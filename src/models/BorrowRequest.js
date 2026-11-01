import mongoose from "mongoose";

const borrowRequestSchema = new mongoose.Schema(
  {
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "FULFILLED"],
      default: "PENDING",
      index: true,
    },
    requestDate: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
    borrowRecord: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRecord" },
  },
  { timestamps: true }
);

borrowRequestSchema.index({ reader: 1, book: 1, status: 1 });

export default mongoose.models.BorrowRequest || mongoose.model("BorrowRequest", borrowRequestSchema);
