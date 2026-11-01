import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { ok, fail, handleError } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  address: z.string().min(2).max(300),
  password: z.string().min(8).max(72),
});

function makeReaderId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ILR-${year}-${rand}`;
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const data = schema.parse(body);

    const email = data.email.toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) return fail("An account with this email already exists.", 409);

    const user = new User({
      fullName: data.fullName,
      email,
      phone: data.phone,
      address: data.address,
      role: "READER",
      status: "ACTIVE",
      readerId: makeReaderId(),
    });
    await user.setPassword(data.password);
    await user.save();

    // অ্যাডমিনকে নোটিফিকেশন পাঠানো
    const admin = await User.findOne({ role: "SUPERADMIN" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        type: "NEW_READER",
        title: "New Reader Registered",
        message: `${data.fullName} (${data.email}) just created an account.`,
        link: "/admin/readers",
      });
    }

    return ok({
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        readerId: user.readerId,
      },
    }, 201);
  } catch (err) {
    return handleError(err);
  }
}
