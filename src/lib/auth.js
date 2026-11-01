import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
        if (!user || user.status !== "ACTIVE") return null;

        const ok = await user.verifyPassword(parsed.data.password);
        if (!ok) return null;

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          readerId: user.readerId || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.readerId = user.readerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.uid;
        session.user.role = token.role;
        session.user.readerId = token.readerId;
      }
      return session;
    },
  },
});
