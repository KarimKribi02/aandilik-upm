"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import {
  Construction,
  LogOut,
  Home,
  Tractor,
  Info,
  HelpCircle,
  Phone,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useData();
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Session terminée.", "info");
    router.push("/");
  };

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const links = [
    { href: "/", label: "Accueil", icon: <Home size={13} strokeWidth={2} /> },
    { href: "/equipment", label: "Matériels", icon: <Tractor size={13} strokeWidth={2} /> },
    { href: "/about", label: "À propos", icon: <Info size={13} strokeWidth={2} /> },
    { href: "/how-it-works", label: "Comment ça marche", icon: <HelpCircle size={13} strokeWidth={2} /> },
    { href: "/contact", label: "Contact", icon: <Phone size={13} strokeWidth={2} /> },
  ];

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className="w-full max-w-6xl transition-all duration-300"
        >
          {/* Main pill bar */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-gray-200/50 px-3 py-2.5 flex items-center justify-between gap-3 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]">

            {/* LEFT — Logo + Yellow CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FFB800] rounded-lg flex items-center justify-center text-black">
                  <Construction size={15} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black tracking-tighter text-gray-900">
                  AANDIL<span className="text-gray-400">IK</span>
                </span>
              </Link>

              <div className="h-4 w-px bg-gray-200 hidden lg:block" />

              <Link
                href="/equipment"
                className="hidden lg:flex items-center gap-2 bg-[#FFB800] hover:bg-[#f0ad00] text-gray-900 text-[11px] font-black px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Menu size={12} strokeWidth={2.5} />
                MATÉRIELS
                <ChevronDown size={10} strokeWidth={3} />
              </Link>
            </div>

            {/* CENTER — Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap",
                    pathname === link.href
                      ? "bg-gray-100 text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span className={pathname === link.href ? "text-[#FFB800]" : "text-gray-300"}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* RIGHT — Auth */}
            <div className="flex items-center gap-2 shrink-0">
              {!currentUser ? (
                <>
                  <Link href="/register">
                    <span className="text-[11px] font-black bg-gray-900 text-[#FFB800] hover:bg-black px-4 py-2 rounded-xl transition-colors shadow-lg shadow-black/10">
                      S&apos;inscrire
                    </span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <LayoutDashboard size={13} />
                    <span className="hidden md:block">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors border border-gray-100"
              >
                {mobileOpen ? <X size={14} /> : <Menu size={14} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="lg:hidden mt-1 bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-200/50 overflow-hidden shadow-2xl">
              <div className="p-3 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 text-xs font-bold px-4 py-3 rounded-xl transition-all",
                      pathname === link.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className={pathname === link.href ? "text-[#FFB800]" : "text-gray-300"}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                ))}
                {!currentUser && (
                  <div className="flex pt-2 border-t border-gray-100 mt-1">
                    <Link href="/register" className="w-full text-center text-[11px] font-black bg-gray-900 text-[#FFB800] py-2.5 rounded-xl">
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};
