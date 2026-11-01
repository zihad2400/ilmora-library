import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, readAt: 1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
