import "./globals.css";
import Providers from "@/components/Providers";
import { ToastProvider } from "@/context/ToastContext";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "ILMORA — Knowledge, Discovery & Learning",
  description: "Islamic & Educational Digital Library Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <ToastProvider>
            <div className="flex-1">
              {children}
            </div>
            {/* ফুটারটি Suspense-এ র‍্যাপ করা হলো কারণ এটি async ডাটা ফেচ করে */}
            <Suspense fallback={<div className="h-32 bg-[#050812]"></div>}>
              <Footer />
            </Suspense>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
