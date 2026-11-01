import PublicNav from "@/components/layout/PublicNav";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - ILMORA Library",
};

export default function PrivacyPage() {
  const lastUpdated = "November 1, 2026";

  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[#050812] text-white pt-10 pb-24 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]"></div>

        <div className="mx-auto max-w-4xl px-6">
          
          {/* হেডার */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Policy</span>
            </h1>
            <p className="text-gray-400">Last updated: {lastUpdated}</p>
          </div>

          {/* কন্টেন্ট সেকশন */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md space-y-8 shadow-2xl">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to ILMORA ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our digital library management system and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">2. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or otherwise contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-white">Personal Data:</strong> Full name, email address, phone number, and physical address.</li>
                <li><strong className="text-white">Account Data:</strong> Reader ID, password (encrypted), and account status.</li>
                <li><strong className="text-white">Borrowing Data:</strong> Books requested, approved, borrowed, returned, and any associated fines.</li>
                <li><strong className="text-white">Usage Data:</strong> IP address, browser type, and interaction with the system.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use personal information collected via our platform for a variety of business purposes described below:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>To facilitate account creation and logon process.</li>
                <li>To manage book borrowing requests and maintain library inventory.</li>
                <li>To send administrative information, notifications, and updates.</li>
                <li>To enforce our terms, conditions, and policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. Passwords are securely hashed using bcrypt, and access to administrative data is restricted to the Super Admin. However, despite our safeguards, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">5. Sharing Your Information</h2>
              <p className="text-gray-300 leading-relaxed">
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">6. Your Privacy Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In some regions, you have certain rights under applicable data protection laws. These may include the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Request access and obtain a copy of your personal information.</li>
                <li>Request rectification or erasure of your personal information.</li>
                <li>Restrict the processing of your personal information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">7. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions or comments about this notice, you may email us at <a href="mailto:privacy@ilmora.com" className="text-purple-400 hover:underline">privacy@ilmora.com</a> or by post to:
              </p>
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400">
                <strong>ILMORA Library</strong><br />
                123 Knowledge Street<br />
                Dhaka, Bangladesh
              </div>
            </section>

          </div>

          {/* নিচের বাটন */}
          <div className="mt-12 text-center">
            <Link href="/" className="btn-ghost inline-flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
