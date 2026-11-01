import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { requireUser } from "@/lib/session";
import { ok, handleError } from "@/lib/api";

// সব নোটিফিকেশন রিড মার্ক করা
export async function POST() {
  try {
    const user = await requireUser();
    await connectDB();
    
    await Notification.updateMany(
      { user: user.id, readAt: null },
      { $set: { readAt: new Date() } }
    );
    
    return ok({ message: "All marked as read" });
  } catch (err) {
    return handleError(err);
  }
}
