
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getRoleFromId } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("acadex_user");
    router.push("/login");
  }, [router]);

  useEffect(() => {
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

  useEffect(() => {
    if (!isReady) return;
    
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        toast({
          title: "Session expirée",
          description: "Déconnexion automatique pour inactivité.",
          variant: "destructive"
        });
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [handleLogout, toast, isReady]);

  const role = useMemo(() => user ? getRoleFromId(user.id) : null, [user]);

  if (!isReady || !user || !role) {
    return (
      <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1A6B4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex overflow-hidden">
      <Sidebar role={role} userName={user.name} />
      <div className="flex-1 flex flex-col ml-64 min-h-screen overflow-hidden">
        <Topbar role={role} userName={user.name} />
        <main className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="p-8 lg:p-10 max-w-[1440px] mx-auto">
            {children}
          </div>
          <footer className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 bg-white/50">
            © 2024 ACADEX Premium Systems • Excellence Éducative
          </footer>
        </main>
      </div>
    </div>
  );
};
