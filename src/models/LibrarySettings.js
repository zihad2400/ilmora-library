import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "GLOBAL" },
    defaultBorrowDays: { type: Number, default: 14, min: 1 },
    maxBooksPerReader: { type: Number, default: 5, min: 1 },
    allowRenewals: { type: Boolean, default: true },
    maxRenewalCount: { type: Number, default: 1 },
    renewalDays: { type: Number, default: 14 },
    reserveOnPending: { type: Boolean, default: false },
    reservationExpirationHours: { type: Number, default: 48 },
    enableFine: { type: Boolean, default: true },
    dailyFineAmount: { type: Number, default: 10 },
    maxFine: { type: Number, default: 500 },
    allowFineWaiver: { type: Boolean, default: true },
    timezone: { type: String, default: "Asia/Dhaka" },
  },
  { timestamps: true }
);

export default mongoose.models.LibrarySettings || mongoose.model("LibrarySettings", settingsSchema);
