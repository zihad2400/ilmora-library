"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function FooterNewsletter() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // সিমুলেটেড সাবস্ক্রিপশন
    setTimeout(() => {
      addToast("Successfully subscribed to the newsletter!", "success");
      setEmail("");
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Newsletter</h3>
      <p className="text-xs text-gray-400 mb-3">Get the latest updates about new books and features.</p>
      <form onSubmit={handleSubscribe} className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1 focus-within:border-purple-500 transition-colors">
        <input 
          type="email" 
          placeholder="Your Email Address" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white placeholder:text-gray-500 min-w-0"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
        >
          {loading ? "Wait..." : "Subscribe ➔"}
        </button>
      </form>
    </div>
  );
}
