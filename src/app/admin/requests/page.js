import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import AdminRequestsClient from "@/components/admin/AdminRequestsClient";
import { connection } from "next/server";

export const instant = false;

export default async function AdminRequestsPage() {
  await connection();
  await connectDB();

  const requests = await BorrowRequest.find({})
    .populate("reader", "fullName readerId email")
    .populate({
      path: "book",
      select: "title availableCopies coverImageUrl authors",
      populate: { path: "authors", select: "name" }
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Borrow Requests</h1>
          <p className="text-sm text-gray-400">Review and manage book requests from readers.</p>
        </div>
      </div>
      
      <AdminRequestsClient initialRequests={JSON.parse(JSON.stringify(requests))} />
    </div>
  );
}
