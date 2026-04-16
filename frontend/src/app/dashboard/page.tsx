"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";

export default function DashboardRedirect() {
  const { currentUser } = useData();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace(`/dashboard/${currentUser.role.toLowerCase()}`);
    } else {
      router.replace("/login");
    }
  }, [currentUser, router]);

  return (
    <div className="flex items-center justify-center p-32">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary font-bold text-sm uppercase tracking-widest">Architecting your session...</p>
      </div>
    </div>
  );
}
