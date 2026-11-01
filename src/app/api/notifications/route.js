import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { requireUser } from "@/lib/session";
import { ok, handleError } from "@/lib/api";

// ইউজারের নোটিফিকেশন লিস্ট
export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    
    const notifications = await Notification.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
      
    return ok({ notifications });
  } catch (err) {
    return handleError(err);
  }
}
