import ReaderNav from "@/components/layout/ReaderNav";

export default function ReaderLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070b1a] text-white">
      <ReaderNav />
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}
