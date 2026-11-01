"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // ডাটা ফেচ
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications.filter(n => !n.readAt).length);
      }
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // প্রতি ৩০ সেকেন্ড পর পর চেক করবে
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // ওপেন করলে সব রিড মার্ক করা
      try {
        await fetch("/api/notifications/read", { method: "POST" });
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, readAt: new Date() })));
      } catch (err) {}
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* বেল আইকন */}
      <button 
        onClick={handleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        
        {/* আনরিড কাউন্টার */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ড্রপডাউন */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d1224] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{notifications.length} New</span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <Link 
                  key={n._id} 
                  href={n.link || "#"}
                  className={`block p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.readAt ? 'bg-purple-500/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </div>
                    <div>
                      <h4 className={`text-xs ${!n.readAt ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{n.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-gray-500 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
