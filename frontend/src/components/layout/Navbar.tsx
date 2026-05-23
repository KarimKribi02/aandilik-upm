"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import {
  LogOut,
  Home,
  Tractor,
  Info,
  HelpCircle,
  Phone,
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <nav className="w-full max-w-6xl transition-all duration-300">
          {/* Sticky glassmorphism bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/50 px-5 py-3 flex items-center justify-between gap-3 shadow-lg shadow-slate-200/40">

            {/* LEFT — Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/aandilik.png" 
                  alt="AANDILIK" 
                  className="h-7 w-auto object-contain"
                />
              </Link>
            </div>

            {/* CENTER — Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap uppercase tracking-wider",
                      isActive
                        ? "bg-primary text-zinc-950 shadow-sm shadow-primary/10 border border-primary/20"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-slate-100/60"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT — Authentication Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {!currentUser ? (
                <>
                  <Link 
                    href="/login" 
                    className="text-[11px] font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-950 px-3 py-2 transition-all"
                  >
                    Connexion
                  </Link>
                  <Link href="/register" className="active:scale-95 transition-all">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-zinc-950 text-primary hover:bg-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-black/10 border border-zinc-800">
                      S&apos;inscrire
                    </span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-950 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
                  >
                    <LayoutDashboard size={13} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors border border-slate-200/60 cursor-pointer"
              >
                {mobileOpen ? <X size={14} /> : <Menu size={14} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/50 overflow-hidden shadow-2xl">
              <div className="p-3 flex flex-col gap-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl transition-all",
                        isActive
                          ? "bg-primary text-zinc-950 shadow-sm"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-slate-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {!currentUser && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 mt-2">
                    <Link 
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center text-xs font-black uppercase tracking-wider text-zinc-600 py-2.5 hover:bg-slate-50 rounded-xl"
                    >
                      Connexion
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center text-xs font-black uppercase tracking-wider bg-zinc-950 text-primary py-2.5 rounded-xl transition-all shadow-md"
                    >
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
