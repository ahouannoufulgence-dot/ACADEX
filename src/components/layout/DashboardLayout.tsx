"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getRoleFromId } from "@/lib/auth-utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérification rapide de la session
    const savedUser = localStorage.getItem("acadex_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("acadex_user");
        router.push("/login");
      }
    }
    setIsReady(true);
  }, [router]);

  const role = useMemo(() => user ? getRoleFromId(user.id) : null, [user]);

  if (!isReady || !user || !role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Sidebar role={role} userName={user.name} />
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <Topbar role={role} userName={user.name} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto scroll-smooth">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};