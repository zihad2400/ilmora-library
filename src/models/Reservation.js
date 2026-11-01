import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    queuePosition: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["WAITING", "READY", "FULFILLED", "EXPIRED", "CANCELLED"],
      default: "WAITING",
      index: true,
    },
    reservedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    notifiedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
