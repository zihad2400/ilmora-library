import PublicNav from "@/components/layout/PublicNav";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy - ILMORA Library",
};

export default function CookiesPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[#050812] text-white pt-10 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[120px]"></div>

        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Policy</span>
            </h1>
            <p className="text-gray-400">Last updated: November 1, 2026</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md space-y-8 shadow-2xl">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">1. What Are Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">2. How We Use Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-white">Authentication:</strong> To keep you logged in and secure your session.</li>
                <li><strong className="text-white">Preferences:</strong> To remember your settings and preferences.</li>
                <li><strong className="text-white">Security:</strong> To protect against unauthorized access and prevent fraud.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">3. Managing Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                Most web browsers allow you to control cookies through their settings. However, disabling cookies may affect the functionality of this library system, particularly the login and borrowing features.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-ghost inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
