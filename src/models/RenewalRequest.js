import mongoose from "mongoose";

const renewalRequestSchema = new mongoose.Schema(
  {
    borrowRecord: { type: mongoose.Schema.Types.ObjectId, ref: "BorrowRecord", required: true, index: true },
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    requestedNewDueDate: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.RenewalRequest || mongoose.model("RenewalRequest", renewalRequestSchema);
