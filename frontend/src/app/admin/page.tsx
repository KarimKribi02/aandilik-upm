"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";

export default function AdminRootRedirect() {
  const router = useRouter();
  const { currentUser } = useData();

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary font-bold text-sm tracking-widest uppercase">Re-routing to Secure Operations...</p>
      </div>
    </div>
  );
}
