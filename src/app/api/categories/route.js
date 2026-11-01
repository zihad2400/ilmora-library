import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { ok, handleError } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();
    const items = await Category.find({}).sort({ order: 1, name: 1 }).lean();
    return ok({ items });
  } catch (err) {
    return handleError(err);
  }
}
