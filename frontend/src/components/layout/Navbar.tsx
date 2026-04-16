"use client";

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

  const handleLogout = () => {
    logout();
    showToast("Session terminated safely.", "info");
    router.push("/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Catalog" },
    ...(currentUser ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass px-8 py-4 rounded-2xl border border-white/20 flex items-center justify-between cosmic-shadow">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
            <Construction size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Aandil<span className="text-primary">ik</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(link.href) && link.href !== "/" ? "text-primary" : 
                pathname === link.href ? "text-primary" : "text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-surface-low rounded-xl border border-surface-container">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-secondary">{currentUser.name.split(' ')[0]}</span>
              </div>
              <Button variant="tertiary" size="sm" onClick={handleLogout} className="text-secondary hover:text-red-500">
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="glass" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Join Network
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
