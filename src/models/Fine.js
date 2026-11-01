import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    borrowRecord: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRecord", required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, default: "OVERDUE" },
    status: {
      type: String,
      enum: ["UNPAID", "PAID", "WAIVED"],
      default: "UNPAID",
      index: true,
    },
    paidAt: { type: Date },
    waivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Fine || mongoose.model("Fine", fineSchema);
