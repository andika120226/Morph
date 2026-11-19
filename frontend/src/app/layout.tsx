import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MORPH Bandar Lampung — Smart Waste Management Ecosystem",
  description:
    "Academic Technopreneurship Prototype - MORPH Smart Waste Ecosystem Bandar Lampung",
  robots: {
    index: false,
    follow: false,
  },
  keywords: [
    "MORPH Bandar Lampung",
    "TeknoHijau",
    "Academic Technopreneurship Prototype",
    "Smart Waste Ecosystem",
    "Bandar Lampung",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Academic Technopreneurship Prototype - MORPH Smart Waste Ecosystem Bandar Lampung"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
