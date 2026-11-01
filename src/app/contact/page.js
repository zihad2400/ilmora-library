"use client";

import { useState } from "react";
import PublicNav from "@/components/layout/PublicNav";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // সিমুলেটেড সাবমিশন
    setTimeout(() => {
      addToast("Message sent successfully! We will get back to you soon.", "success");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[#050812] text-white pt-10 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]"></div>
        
        <div className="mx-auto max-w-5xl px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Contact Us</h1>
            <p className="text-gray-400 text-lg">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* বাম দিকের কন্টাক্ট ইনফো */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <h3 className="text-lg font-bold">Phone</h3>
                </div>
                <p className="text-gray-400 text-sm">+880 1234 567890</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <h3 className="text-lg font-bold">Email</h3>
                </div>
                <p className="text-gray-400 text-sm">info@ilmora.com</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h3 className="text-lg font-bold">Address</h3>
                </div>
                <p className="text-gray-400 text-sm">123 Knowledge Street, Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* ডান দিকের ফর্ম */}
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Your Name</label>
                  <input 
                    type="text" 
                    required
                    className="input bg-black/30" 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Your Email</label>
                  <input 
                    type="email" 
                    required
                    className="input bg-black/30" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea 
                    rows={4}
                    required
                    className="input bg-black/30" 
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 mt-2"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>

          </div>

        </div>
      </main>
    </>
  );
}
