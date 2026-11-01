import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // index: true সরানো হয়েছে
    bio: { type: String, default: "" },
    nationality: { type: String, default: "" },
    birthYear: { type: Number },
    deathYear: { type: Number },
  },
  { timestamps: true }
);

// এককভাবে ইনডেক্স ডিক্লেয়ার করা হয়েছে
authorSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Author || mongoose.model("Author", authorSchema);
