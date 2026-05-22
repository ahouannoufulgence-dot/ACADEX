"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getRoleFromId } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const role = user ? getRoleFromId(user.id) : null;

  if (!isReady || !user || !role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex relative max-w-full overflow-x-hidden">
      <Sidebar 
        role={role} 
        userName={user.name} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 w-full",
        "lg:ml-64"
      )}>
        <Topbar 
          role={role} 
          userName={user.name} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
            {children}
          </div>
          <footer className="p-6 text-center text-slate-400 text-[9px] font-black uppercase tracking-widest border-t border-slate-100 bg-white/50">
            © 2024 ACADEX Premium Systems • Excellence Éducative
          </footer>
        </main>
      </div>
    </div>
  );
};