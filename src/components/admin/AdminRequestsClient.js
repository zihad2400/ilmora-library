"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function AdminRequestsClient({ initialRequests }) {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/borrow-requests/${id}/approve`, { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) {
        addToast(data.error || "Failed to approve", "error");
        return;
      }
      
      addToast("Request approved and book issued successfully!", "success");
      setRequests(requests.map(r => r._id === id ? { ...r, status: "APPROVED" } : r));
      setSelectedReq(null);
      router.refresh();
    } catch (err) {
      addToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      addToast("Please provide a reason for rejection.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/borrow-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        addToast(data.error || "Failed to reject", "error");
        return;
      }
      
      addToast("Request rejected successfully.", "success");
      setRequests(requests.map(r => r._id === id ? { ...r, status: "REJECTED" } : r));
      setSelectedReq(null);
      setRejectReason("");
      router.refresh();
    } catch (err) {
      addToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Reader</th>
              <th className="px-6 py-4 font-medium">Book</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{req.reader?.fullName}</div>
                  <div className="text-xs text-gray-400">{req.reader?.readerId}</div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <div className="font-medium">{req.book?.title}</div>
                  <div className="text-xs text-gray-500">Stock: {req.book?.availableCopies}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    req.status === 'PENDING' ? 'badge-amber' : 
                    req.status === 'APPROVED' ? 'badge-green' : 'badge-red'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {req.status === 'PENDING' ? (
                    <button 
                      onClick={() => setSelectedReq(req)}
                      className="text-purple-400 hover:text-purple-300 font-medium bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-lg transition-all"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">Done</span>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0d1224] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Review Request</h2>
                <button onClick={() => setSelectedReq(null)} className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div className="space-y-3 mb-6 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Reader</span>
                  <span className="text-white font-medium">{selectedReq.reader?.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Book</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">{selectedReq.book?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Stock</span>
                  <span className={selectedReq.book?.availableCopies > 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                    {selectedReq.book?.availableCopies} Copies
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Rejection Reason (Only if rejecting)</label>
                <input 
                  type="text" 
                  className="input bg-black/30" 
                  placeholder="E.g., No stock available..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(selectedReq._id)}
                  disabled={loading || selectedReq.book?.availableCopies <= 0}
                  className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  {loading ? "Processing..." : "Approve & Issue"}
                </button>
                <button 
                  onClick={() => handleReject(selectedReq._id)}
                  disabled={loading}
                  className="btn-danger flex-1 justify-center py-3"
                >
                  {loading ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
