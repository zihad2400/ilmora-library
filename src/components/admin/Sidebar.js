"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useToast } from "@/context/ToastContext";
import NotificationBell from "../ui/NotificationBell";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Books", href: "/admin/books", icon: "📚" },
  { name: "Readers", href: "/admin/readers", icon: "👥" },
  { name: "Borrow Requests", href: "/admin/requests", icon: "📝" },
  { name: "Issued Books", href: "/admin/issued", icon: "📖" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    addToast("Logged out successfully. Goodbye!", "success");
    setTimeout(() => signOut({ callbackUrl: "/login" }), 800);
  };

  return (
    <>
      {/* মোবাইল টপ বার */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0b1228] border-b border-white/10 flex items-center justify-between px-4 z-40">
        <Link href="/admin" className="text-xl font-black">
          IL<span style={{ color: "var(--il-primary)" }}>MORA</span>
        </Link>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"></div>
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#0b1228] flex flex-col z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex h-20 items-center px-6 border-b border-white/10 justify-between">
          <Link href="/admin" className="text-2xl font-black tracking-tighter">
            IL<span style={{ color: "var(--il-primary)" }}>MORA</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="hidden md:flex mb-4 justify-center">
             <NotificationBell />
          </div>
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-2">
            <span className="text-lg">🌐</span>
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
