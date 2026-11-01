import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPERADMIN")
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  return user;
}
