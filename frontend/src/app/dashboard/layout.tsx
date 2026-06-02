"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Bell, Search, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Determine role based on URL (only admin and owner)
  const requiredRole = pathname.includes("/admin") ? "admin" : "owner";
      
  useEffect(() => {
    // If no token exists at all natively in local storage, boot immediately
    if (!localStorage.getItem("aandilik_token")) {
      router.push("/"); // Replace with "/login" if a login page exists
      return;
    }

    // Checking precise role matching when currentUser data is hydrated
    if (currentUser) {
      const userRole = currentUser.role.toLowerCase();
      const isAdmin = userRole === "admin" || userRole.includes("admin");
      const isOwner = userRole === "owner" || userRole.includes("propri");

      // Guard for owner sub-routes that are admin-only
      const isForbiddenOwnerRoute = 
        pathname.includes("/owner/fleet-validation") || 
        pathname.includes("/owner/global-monitoring");

      if (isForbiddenOwnerRoute && !isAdmin) {
        router.push("/dashboard/owner");
        return;
      }

      if (requiredRole === "admin" && !isAdmin) {
        router.push(isOwner ? "/dashboard/owner" : "/");
      }
      if (requiredRole === "owner" && !isOwner && !isAdmin) {
        router.push("/");
      }
    }
  }, [pathname, currentUser, requiredRole, router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        role={requiredRole as any} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        {/* Dashboard Header */}
        <header className="h-20 border-b border-slate-200/50 flex items-center justify-between px-6 md:px-12 bg-white sticky top-0 z-30 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="relative w-48 sm:w-64 md:w-96 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Button variant="tertiary" size="sm" className="p-2 relative rounded-xl hover:bg-slate-50">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
            </Button>
            
            <div className="w-px h-6 bg-slate-200" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-slate-900 capitalize">{currentUser?.name || "Authenticating..."}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{currentUser?.role || requiredRole}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 md:p-12 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
