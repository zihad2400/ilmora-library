"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

const inputStyle = {
  backgroundColor: "#0d1530",
  color: "#ffffff",
  WebkitTextFillColor: "#ffffff",
  WebkitBoxShadow: "0 0 0 1000px #0d1530 inset",
  transition: "background-color 5000s ease-in-out 0s"
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      setSuccess(`Account created! Your Reader ID is ${data.user.readerId}. Redirecting to login...`);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      
      <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-purple-600/30 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]"></div>

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
          Create your reader account
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl" autoComplete="off">
        {error && <div className="error-box animate-pulse">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <div>
          <label className="label">Full Name</label>
          <input name="fullName" className="input w-full border border-gray-600/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" style={inputStyle} value={form.fullName} onChange={onChange} autoComplete="off" placeholder="John Doe" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" className="input w-full border border-gray-600/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" style={inputStyle} value={form.email} onChange={onChange} autoComplete="off" placeholder="john@example.com" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input name="phone" className="input w-full border border-gray-600/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" style={inputStyle} value={form.phone} onChange={onChange} autoComplete="off" placeholder="+880 1XXX XXXXXX" required />
        </div>
        <div>
          <label className="label">Address</label>
          <textarea name="address" rows={2} className="input w-full border border-gray-600/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" style={inputStyle} value={form.address} onChange={onChange} autoComplete="off" placeholder="Your full address" required />
        </div>
        
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              minLength={8} 
              className="input w-full border border-gray-600/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all pr-12" 
              style={inputStyle}
              value={form.password} 
              onChange={onChange} 
              autoComplete="new-password" 
              placeholder="••••••••"
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button disabled={loading} className="btn-primary w-full justify-center py-3 text-lg font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all">
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm" style={{ color: "var(--il-muted)" }}>
          Already registered?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--il-primary)" }}>Sign In</Link>
        </p>
      </form>
    </main>
  );
}
