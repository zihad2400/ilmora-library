import PublicNav from "@/components/layout/PublicNav";
import Link from "next/link";

export const metadata = {
  title: "About Us - ILMORA Library",
};

export default function AboutPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[#050812] text-white pt-10 pb-20 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]"></div>

        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">ILMORA</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover the story behind your premium Islamic & Educational digital library.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                At ILMORA, our mission is to bridge the gap between traditional Islamic knowledge and modern technology. We believe that access to authentic Islamic literature, Tafsir, Hadith, and top-tier educational resources should be seamless, intuitive, and available to everyone.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We strive to foster a culture of continuous learning by providing a smart, beautifully designed, and highly functional digital catalog for our physical library.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl">📚</div>
                  <div>
                    <h3 className="font-bold">Vast Collection</h3>
                    <p className="text-xs text-gray-400">Thousands of Islamic & CSE books.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">⚡</div>
                  <div>
                    <h3 className="font-bold">Dynamic System</h3>
                    <p className="text-xs text-gray-400">Real-time borrowing and admin approvals.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl">🛡️</div>
                  <div>
                    <h3 className="font-bold">Secure & Reliable</h3>
                    <p className="text-xs text-gray-400">Safe authentication and data protection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-3xl p-10">
            <h2 className="text-2xl font-bold mb-4">Join the ILMORA Community</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Become a reader today and get access to our exclusive collection of knowledge.
            </p>
            <Link href="/register" className="btn-primary px-8 py-3 rounded-xl text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              Create an Account
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
