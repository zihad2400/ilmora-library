import PublicNav from "@/components/layout/PublicNav";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions - ILMORA Library",
};

export default function TermsPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[#050812] text-white pt-10 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]"></div>

        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Conditions</span>
            </h1>
            <p className="text-gray-400">Last updated: November 1, 2026</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md space-y-8 shadow-2xl">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using ILMORA Library, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">2. Borrowing Rules</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All book borrowing requests are subject to administrator approval. Readers must adhere to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>The default borrowing duration is exactly 14 days.</li>
                <li>Readers cannot issue books directly; explicit admin approval is required.</li>
                <li>Books must be returned in the same condition they were issued.</li>
                <li>Overdue or damaged books may result in fines or account suspension.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">3. User Accounts</h2>
              <p className="text-gray-300 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. ILMORA reserves the right to suspend accounts that violate library policies.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">4. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                For any questions regarding these Terms, please contact us at <a href="mailto:info@ilmora.com" className="text-purple-400 hover:underline">info@ilmora.com</a>.
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
