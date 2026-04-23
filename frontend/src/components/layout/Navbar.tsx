"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Construction, LayoutDashboard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useData();
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Session terminated safely.", "info");
    router.push("/");
  };

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Catalog" },
    { href: "/track", label: "Track" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    ...(currentUser ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500">
      <div className={cn(
        "transition-all duration-500 px-8 h-20 rounded-[28px] flex items-center justify-between shadow-2xl border",
        scrolled 
          ? "bg-white/90 backdrop-blur-xl border-black/5" 
          : "bg-black/20 backdrop-blur-2xl border-white/10"
      )}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40 group-hover:rotate-6 transition-transform">
            <Construction size={22} />
          </div>
          <span className={cn(
            "text-xl font-black tracking-tighter transition-colors duration-500",
            scrolled ? "text-foreground" : "text-white"
          )}>
            Aandil<span className="text-primary italic">ik</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { href: "/", label: "Accueil" },
            { href: "/equipment", label: "Équipements" },
            { href: "/track", label: "Suivi" },
            { href: "/about", label: "À propos" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all group",
                pathname === link.href 
                  ? "text-primary" 
                  : (scrolled ? "text-secondary hover:text-primary" : "text-white/60 hover:text-white")
              )}
            >
              {link.label}
              <span className={cn(
                "absolute bottom-0 left-5 right-5 h-0.5 bg-primary rounded-full transition-all duration-300 transform origin-left scale-x-0 group-hover:scale-x-100",
                pathname === link.href && "scale-x-100"
              )} />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                scrolled 
                  ? "border-black/5 bg-black/5 text-secondary hover:bg-black/10" 
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
              )}>
                <User size={18} />
              </Link>
              <Button variant="tertiary" size="sm" onClick={handleLogout} className={cn(
                "h-10 w-10 p-0 transition-colors",
                scrolled ? "text-secondary/40 hover:text-red-500" : "text-white/40 hover:text-red-500"
              )}>
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/contact">
                <Button size="sm" className="px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Contactez-nous
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
