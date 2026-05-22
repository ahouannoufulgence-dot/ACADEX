
"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, HelpCircle, Calendar as CalendarIcon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserRole, getRoleName } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  role: UserRole;
  userName: string;
}

export const Topbar = ({ role, userName }: TopbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setMounted(true);
    setToday(new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  return (
    <header className="h-20 bg-white sticky top-0 z-30 flex items-center justify-between px-8 border-b border-slate-100 shadow-sm">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1A6B4A] transition-colors" />
          <Input 
            placeholder="Rechercher un dossier, une note, un ID..." 
            className="pl-12 bg-[#F5F7F9] border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#1A6B4A] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {mounted && (
          <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-[#F5F7F9] rounded-xl text-xs font-bold text-slate-500">
            <CalendarIcon className="w-4 h-4 text-[#1A6B4A]" />
            <span className="capitalize">{today}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[#F5F7F9] transition-colors text-slate-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white" />
          </button>
          
          <button className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[#F5F7F9] transition-colors text-slate-600">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1F2937] leading-none mb-1">{userName}</p>
            <Badge variant="secondary" className="text-[10px] h-4 font-bold bg-[#1A6B4A]/10 text-[#1A6B4A] border-none uppercase tracking-tighter">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1A6B4A] to-[#1A6B4A]/60 p-0.5 shadow-lg shadow-[#1A6B4A]/20">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-sm font-bold text-[#1A6B4A]">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
