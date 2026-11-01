import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Next.js 16 ডাইনামিক রেন্ডারিং ফিক্স
export const instant = false;

export default async function DashboardRouter() {
  const session = await auth();
  
  // ১. ইউজার লগইন না থাকলে লগইন পেজে যাবে
  if (!session?.user) {
    redirect("/login");
  }

  // ২. ইউজার অ্যাডমিন হলে অ্যাডমিন প্যানেলে যাবে
  if (session.user.role === "SUPERADMIN") {
    redirect("/admin");
  }

  // ৩. অন্যথায় (রিডার হলে) রিডার প্যানেলে যাবে
  redirect("/reader");
}
