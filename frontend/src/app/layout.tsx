import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MORPH - On-Demand Waste Management System",
  description:
    "Platform Gojek-style penjemputan sampah on-demand di Indonesia. Lapor sampah, armada jemput sesuai rekomendasi AI, dan kumpulkan poin reward ramah lingkungan.",
  keywords: ["MORPH", "waste management", "lapor sampah", "eco green", "daur ulang", "on-demand sampah"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
