"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Recycle,
  MapPin,
  Gift,
  PlusCircle,
  Menu,
  X,
  Coins,
  User,
  MessageSquare,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sembunyikan Navbar pada halaman Splash Screen (/), Login, dan Register
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Recycle },
    { href: "/cleanup-request", label: "Lapor Sampah", icon: PlusCircle },
    { href: "/driver-map", label: "Peta Driver", icon: MapPin },
    { href: "/rewards", label: "Tukar Rewards", icon: Gift },
    { href: "/contact", label: "Kontak Kami", icon: MessageSquare },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/95 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#16a34a] flex items-center justify-center shadow-md shadow-[#16a34a]/20 group-hover:scale-105 transition-transform duration-200">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  MORPH
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#f0fdf4] border border-emerald-200 text-[#16a34a]">
                  Eco Waste
                </span>
              </div>
              <p className="text-[11px] text-[#16a34a] font-semibold tracking-wide">
                On-Demand Waste Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#16a34a] text-[#ffffff] shadow-sm shadow-[#16a34a]/25"
                      : "text-slate-600 hover:text-[#16a34a] hover:bg-[#f0fdf4]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-[#16a34a]"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Points Badge & Profile Shortcut */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/rewards"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] hover:bg-emerald-100/80 transition-colors cursor-pointer"
              title="Poin Reward Anda"
            >
              <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-xs font-extrabold text-slate-900">
                1,250 <span className="text-[#16a34a]">Poin</span>
              </span>
            </Link>

            <Link
              href="/profile"
              className="w-9 h-9 rounded-xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] hover:bg-[#16a34a] hover:text-white flex items-center justify-center transition-colors"
              title="Profil"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/rewards"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-bold text-[#16a34a]"
            >
              <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              1,250 pts
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#16a34a] hover:bg-[#f0fdf4]"
              aria-label="Buka navigasi"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-[#ffffff] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-[#16a34a] text-[#ffffff]"
                    : "text-slate-700 hover:bg-[#f0fdf4] hover:text-[#16a34a]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-[#16a34a]"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
