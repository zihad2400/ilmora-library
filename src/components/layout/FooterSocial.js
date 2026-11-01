"use client";

import { useToast } from "@/context/ToastContext";

const SOCIALS = [
  { name: "Facebook", icon: "F", url: "https://facebook.com" },
  { name: "YouTube", icon: "Y", url: "https://youtube.com" },
  { name: "Twitter", icon: "T", url: "https://twitter.com" },
  { name: "LinkedIn", icon: "L", url: "https://linkedin.com" },
  { name: "GitHub", icon: "G", url: "https://github.com" },
  { name: "Discord", icon: "D", url: "https://discord.com" },
];

export default function FooterSocial() {
  const { addToast } = useToast();

  const handleClick = (e, url) => {
    e.preventDefault();
    // নতুন ট্যাবে ওপেন করার সিমুলেশন (যদি লিংক থাকে)
    addToast(`Opening ${url}...`, "info");
    window.open(url, "_blank");
  };

  return (
    <div className="flex gap-3">
      {SOCIALS.map((social, i) => (
        <button 
          key={i} 
          onClick={(e) => handleClick(e, social.url)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-purple-500 hover:border-purple-500 transition-all text-gray-400 hover:text-white"
          title={social.name}
        >
          <span className="text-[10px] uppercase font-bold">{social.icon}</span>
        </button>
      ))}
    </div>
  );
}
