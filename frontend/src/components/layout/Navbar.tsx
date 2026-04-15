"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Construction, LayoutDashboard, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Equipment" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass px-8 py-4 rounded-2xl border border-white/20 flex items-center justify-between cosmic-shadow">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
            <Construction size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Equipment<span className="text-primary">Catalog</span>
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
                pathname === link.href ? "text-primary" : "text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="glass" size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button variant="primary" size="sm">
            Rent Now
          </Button>
        </div>
      </div>
    </nav>
  );
};
