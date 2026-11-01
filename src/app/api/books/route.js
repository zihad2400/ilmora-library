import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { buildBookQuery } from "@/services/catalogue";
import { ok, handleError } from "@/lib/api";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const availability = searchParams.get("availability");
    const sort = searchParams.get("sort");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const { query, sort: sortSpec } = buildBookQuery({ q, category, availability, sort });

    const [items, total] = await Promise.all([
      Book.find(query)
        .populate("authors", "name")
        .populate("publisher", "name")
        .populate("category", "name slug color")
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Book.countDocuments(query),
    ]);

    return ok({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
