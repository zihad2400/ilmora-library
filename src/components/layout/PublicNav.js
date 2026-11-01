"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/books?category=islamic-books", label: "Islamic" },
  { href: "/books?category=cse-books", label: "CSE" },
];

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/books") return pathname === "/books" && !searchParams.get("category");
    if (href.includes("?category=")) {
      const cat = href.split("=")[1];
      return pathname === "/books" && searchParams.get("category") === cat;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b bg-[#070b1a]/80 backdrop-blur-md sticky top-0 z-50" style={{ borderColor: "var(--il-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-black tracking-tight hover:opacity-80 transition">
          IL<span style={{ color: "var(--il-primary)" }}>MORA</span>
        </Link>
        
        <nav className="hidden items-center gap-1 md:flex bg-white/5 p-1 rounded-xl border border-white/5">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10"></div>
          ) : session?.user ? (
            <>
              <Link href="/dashboard" className="btn-primary text-sm shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all">
                {session.user.role === "SUPERADMIN" ? "Admin Panel" : "My Dashboard"}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-red-400 hover:text-red-300 font-medium px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Login</Link>
              <Link href="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function PublicNav() {
  return (
    <Suspense fallback={<div className="h-16 border-b border-white/10 bg-[#070b1a]"></div>}>
      <NavContent />
    </Suspense>
  );
}
