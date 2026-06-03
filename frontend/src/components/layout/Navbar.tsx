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
  Search,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  // Close drawer on path change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/signup"
  ) {
    return null;
  }

  const links = [
    { href: "/", label: "Accueil", icon: <Home size={16} className="text-[#f7941d]" /> },
    { href: "/equipment", label: "Matériels", icon: <Tractor size={16} className="text-[#f7941d]" />, hasSubmenu: true },
    { href: "/track", label: "Suivi de commande", icon: <Search size={16} className="text-[#f7941d]" /> },
    { href: "/about", label: "À propos", icon: <Info size={16} className="text-[#f7941d]" /> },
    { href: "/contact", label: "Contact", icon: <Phone size={16} className="text-[#f7941d]" /> },
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
              <div className="hidden lg:flex items-center gap-2">
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
              </div>

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200/60 cursor-pointer"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer overlay using AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Dark Drawer Content (matching image) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-[#0c0c0e] text-white z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden border-l border-zinc-800"
            >
              <div>
                {/* Header: Logo & Close Button */}
                <div className="flex justify-between items-center mb-10">
                  <Link href="/" onClick={() => setMobileOpen(false)}>
                    <img 
                      src="/aandilik.png" 
                      alt="AANDILIK" 
                      className="h-8 w-auto object-contain brightness-0 invert" 
                    />
                  </Link>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Vertical menu links */}
                <div className="flex flex-col gap-2">
                  {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <div key={link.href} className="flex flex-col">
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            isActive 
                              ? "bg-zinc-900 text-[#f7941d] border border-zinc-800" 
                              : "text-zinc-300 hover:text-white hover:bg-zinc-900/60"
                          )}
                        >
                          <div className="flex items-center gap-3.5">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                          {link.hasSubmenu && <ChevronDown size={14} className="text-zinc-500" />}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA Actions */}
              <div className="flex flex-col gap-3 mt-12 border-t border-zinc-800/80 pt-6">
                {!currentUser ? (
                  <>
                    <Link 
                      href="/equipment"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-[#f7941d] text-zinc-950 hover:bg-[#f7941d]/90 transition-all shadow-md shadow-orange-500/10"
                    >
                      Demander un devis
                    </Link>
                    <Link 
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all"
                    >
                      Se déconnecter
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
