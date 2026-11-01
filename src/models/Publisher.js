import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

publisherSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Publisher || mongoose.model("Publisher", publisherSchema);
