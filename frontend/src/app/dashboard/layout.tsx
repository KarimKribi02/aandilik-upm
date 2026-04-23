"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Bell, Search, User } from "lucide-react";

import { useEffect } from "react";
import { useData } from "@/context/DataProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useData();
  
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
      if (requiredRole === "admin" && userRole !== "admin") {
        router.push(userRole === "owner" ? "/dashboard/owner" : "/");
      }
      if (requiredRole === "owner" && userRole !== "owner" && userRole !== "admin") {
        router.push("/");
      }
    }
  }, [pathname, currentUser, requiredRole, router]);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role={requiredRole as any} />
      
      <main className="flex-1 ml-72">
        {/* Dashboard Header */}
        <header className="h-20 border-b border-surface-container flex items-center justify-between px-12 bg-white sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search assets, users, or records..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="tertiary" size="sm" className="p-2 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </Button>
            <div className="w-px h-6 bg-surface-container mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold capitalize">{currentUser?.name || "Authenticating..."}</div>
                <div className="text-[10px] text-secondary font-medium uppercase tracking-widest">{currentUser?.role || requiredRole}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-bold overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
