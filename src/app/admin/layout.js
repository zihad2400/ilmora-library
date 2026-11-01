import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#070b1a] text-white">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
