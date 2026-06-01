"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Hammer, 
  Clock, 
  Users, 
  ShieldCheck, 
  History, 
  Settings,
  LogOut,
  ChevronRight,
  Construction,
  Handshake,
  BookOpen,
  UserCheck,
  Grid,
  X,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataProvider";

type Role = "owner" | "admin";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: Record<Role, { href: string; label: string; icon: any }[]> = {
  owner: [
    { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/owner/equipment", label: "My Fleet", icon: Hammer },
    { href: "/dashboard/owner/reservations", label: "Rental Requests", icon: Clock },
    { href: "/dashboard/owner/fleet-validation", label: "Fleet Validation", icon: ShieldCheck },
    { href: "/dashboard/owner/global-monitoring", label: "Global Monitoring", icon: History },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Operations", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "User Control", icon: Users },
    { href: "/dashboard/admin/fleet-oversight", label: "Fleet Oversight", icon: Truck },
    { href: "/dashboard/admin/categories", label: "Categories", icon: Grid },
    { href: "/dashboard/admin/blog", label: "Blog Content", icon: BookOpen },
    { href: "/dashboard/admin/partners", label: "Partners", icon: Handshake },
    { href: "/dashboard/admin/experts", label: "Experts & Équipe", icon: UserCheck },
  ],
};

export const Sidebar = ({ role, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useData();
  const items = navItems[role] || navItems.owner;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside 
        className={cn(
          "w-72 h-screen fixed left-0 top-0 border-r border-slate-200/50 bg-white flex flex-col p-8 z-40 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 primary-gradient rounded-xl flex items-center justify-center text-white shadow-sm shadow-primary/20">
              <Construction size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Aandilik <span className="text-primary font-medium">Ops</span>
            </span>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</div>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group active:scale-95",
                pathname === item.href
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-white" : "text-primary group-hover:text-primary-dark"
                )} 
              />
              <span className="flex-1">{item.label}</span>
              {pathname === item.href && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 mt-auto pt-8 border-t border-slate-100">
          <Link 
            href="#" 
            onClick={onClose}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
          >
            <Settings size={20} /> Settings
          </Link>
          <button 
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left active:scale-95"
          >
            <LogOut size={20} /> Exit Dashboard
          </button>
        </div>
      </aside>
    </>
  );
};
