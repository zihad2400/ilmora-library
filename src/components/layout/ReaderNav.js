"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useToast } from "@/context/ToastContext";
import NotificationBell from "../ui/NotificationBell";
import { useState } from "react";

const LINKS = [
  { href: "/reader", label: "Dashboard" },
  { href: "/books", label: "Browse Books" },
  { href: "/reader/requests", label: "My Requests" },
];

export default function ReaderNav() {
  const pathname = usePathname();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    addToast("Logged out successfully. Goodbye!", "success");
    setTimeout(() => signOut({ callbackUrl: "/login" }), 800);
  };

  return (
    <header className="border-b bg-[#070b1a]/80 backdrop-blur-lg sticky top-0 z-50" style={{ borderColor: "var(--il-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/reader" className="text-lg sm:text-xl font-black tracking-tight hover:opacity-80 transition">
          IL<span style={{ color: "var(--il-primary)" }}>MORA</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {LINKS.map((l) => {
            const active = pathname === l.href;
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

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            Logout
          </button>

          {/* মোবাইল মেনু বাটন */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0b1228] px-4 py-4 space-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                pathname === l.href ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
