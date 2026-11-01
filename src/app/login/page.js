"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    setLoading(false);
    
    if (res?.error) {
      addToast("Invalid email or password, or account is suspended.", "error");
      return;
    }
    
    addToast("Welcome back to ILMORA!", "success");
    router.push("/dashboard");
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="absolute top-6 left-6">
        <Link href="/" className="btn-ghost text-sm group">
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Back to Home
        </Link>
      </div>

      <div className="mb-8 text-center">
        <Link href="/" className="inline-block text-4xl font-black tracking-tighter hover:opacity-80 transition">
          IL<span style={{ color: "var(--il-primary)" }}>MORA</span>
        </Link>
        <p className="mt-2 text-sm font-medium tracking-wide" style={{ color: "var(--il-muted)" }}>
          Sign in to continue your journey
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input transition-all focus:ring-2 focus:ring-indigo-500/50" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ilmora.local" required />
        </div>
        
        <div>
          <label className="label">Password</label>
          <input type="password" className="input transition-all focus:ring-2 focus:ring-indigo-500/50" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>

        <button disabled={loading} className="btn-primary w-full justify-center py-3 text-lg font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <p className="text-center text-sm" style={{ color: "var(--il-muted)" }}>
          New here?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--il-primary)" }}>Create an account</Link>
        </p>
      </form>
    </main>
  );
}
