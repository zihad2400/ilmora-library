import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        autoIndex: process.env.NODE_ENV !== "production",
      })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;

  // মডেলগুলো রেজিস্টার করা (শুধুমাত্র প্রোডাকশনে বিল্ড এরর এড়াতে)
  // এই ইমপোর্টগুলো ডাইনামিকভাবে করা হচ্ছে যাতে সার্কুলার ডিপেন্ডেন্সি না হয়
  await import("@/models/User");
  await import("@/models/Book");
  await import("@/models/Author");
  await import("@/models/Publisher");
  await import("@/models/Category");
  await import("@/models/BookCopy");
  await import("@/models/BorrowRequest");
  await import("@/models/BorrowRecord");
  await import("@/models/Notification");
  await import("@/models/LibrarySettings");

  return cached.conn;
}
