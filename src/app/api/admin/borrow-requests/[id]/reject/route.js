import { connectDB } from "@/lib/db";
import BorrowRequest from "@/models/BorrowRequest";
import Notification from "@/models/Notification";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleError } from "@/lib/api";

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const { id } = await params;
    
    const { reason } = await req.json();
    if (!reason) return fail("Rejection reason is required", 400);

    const request = await BorrowRequest.findById(id);
    if (!request) return fail("Request not found", 404);
    if (request.status !== "PENDING") return fail("Request is already processed", 400);

    request.status = "REJECTED";
    request.rejectionReason = reason;
    request.reviewedBy = admin.id;
    request.reviewedAt = new Date();
    await request.save();

    await Notification.create({
      user: request.reader,
      type: "BORROW_REJECTED",
      title: "Request Rejected",
      message: `Your request was rejected. Reason: ${reason}`,
      link: "/reader/requests"
    });

    return ok({ message: "Request rejected successfully." });
  } catch (err) {
    return handleError(err);
  }
}
