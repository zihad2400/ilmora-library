"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function RequestForm({ bookId }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/borrow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to submit request.", "error");
        return;
      }

      addToast("Request submitted successfully!", "success");
      router.push("/reader/requests?success=true");
    } catch (err) {
      addToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/20 mb-6">
        <h4 className="text-sm font-semibold text-purple-300 mb-2">Borrowing Rules:</h4>
        <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
          <li>Default borrowing duration is 14 days.</li>
          <li>Admin approval is required.</li>
          <li>You can only borrow books if you have no overdue books.</li>
        </ul>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full justify-center py-3 text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Confirm Request"}
      </button>
    </form>
  );
}
