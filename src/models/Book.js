import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true }, // text index সরানো হয়েছে
    subtitle: { type: String, default: "" },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    isbn: { type: String, trim: true, unique: true, sparse: true },
    edition: { type: String, default: "" },
    publicationYear: { type: Number },
    language: { type: String, default: "English" },
    description: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    shelfLocation: { type: String, default: "" },
    tags: [{ type: String }],
    isArchived: { type: Boolean, default: false, index: true },
    totalCopies: { type: Number, default: 0, min: 0 },
    availableCopies: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
