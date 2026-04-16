"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarRange, 
  Hammer, 
  Wallet, 
  Clock, 
  Users, 
  ShieldCheck, 
  History, 
  DollarSign,
  Settings,
  LogOut,
  ChevronRight,
  Construction
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataProvider";

type Role = "client" | "owner" | "admin";

interface SidebarProps {
  role: Role;
}

const navItems: Record<Role, { href: string; label: string; icon: any }[]> = {
  client: [
    { href: "/dashboard/client", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/client/reservations", label: "My Reservations", icon: CalendarRange },
  ],
  owner: [
    { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/owner/equipment", label: "My Fleet", icon: Hammer },
    { href: "/dashboard/owner/reservations", label: "Rental Requests", icon: Clock },
    { href: "/dashboard/owner/wallet", label: "Wallet & Earnings", icon: Wallet },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Operations", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "User Control", icon: Users },
    { href: "/dashboard/admin/equipment", label: "Fleet Validation", icon: ShieldCheck },
    { href: "/dashboard/admin/reservations", label: "Global Monitoring", icon: History },
    { href: "/dashboard/admin/transactions", label: "Financials", icon: DollarSign },
  ],
};

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useData();
  const items = navItems[role] || [];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 border-r border-surface-container bg-surface flex flex-col p-8 z-40">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 primary-gradient rounded-xl flex items-center justify-center text-white">
          <Construction size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight">Aandilik <span className="text-secondary font-medium">Ops</span></span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Main Menu</div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
              pathname === item.href
                ? "bg-primary text-white cosmic-shadow"
                : "text-secondary hover:bg-surface-low hover:text-foreground"
            )}
          >
            <item.icon size={20} className={cn(pathname === item.href ? "text-white" : "text-primary")} />
            <span className="flex-1">{item.label}</span>
            {pathname === item.href && <ChevronRight size={14} className="opacity-50" />}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-2 mt-auto pt-8 border-t border-surface-container">
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-secondary hover:bg-surface-low transition-all">
          <Settings size={20} /> Settings
        </Link>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-orange-600 hover:bg-orange-50 transition-all text-left"
        >
          <LogOut size={20} /> Exit Dashboard
        </button>
      </div>
    </aside>
  );
};
