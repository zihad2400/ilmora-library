import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "#6366f1" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
