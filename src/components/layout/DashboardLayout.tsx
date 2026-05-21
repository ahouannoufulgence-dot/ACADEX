"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UserRole, getRoleFromId } from "@/lib/auth-utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("acadex_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;

  const role = getRoleFromId(user.id);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role={role} userName={user.name} />
      <div className="flex-1 flex flex-col ml-64">
        <Topbar role={role} userName={user.name} />
        <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};