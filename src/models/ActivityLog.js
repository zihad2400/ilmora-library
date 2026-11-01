import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, index: true },
    targetType: { type: String, default: "" },
    targetId: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
