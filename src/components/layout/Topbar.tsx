"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, HelpCircle, Calendar as CalendarIcon } from "lucide-react";
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
    <header className="h-24 bg-[#F8FAFC]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-12 border-b border-slate-200/60">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
          <Input 
            placeholder="Rechercher un dossier, une note, un ID..." 
            className="pl-16 bg-white/50 border-none h-14 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#14532D] transition-all text-sm font-medium shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-10">
        {mounted && (
          <div className="hidden xl:flex items-center gap-4 px-6 py-3 bg-white/50 rounded-2xl text-[11px] font-bold text-slate-500 border border-white shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#14532D]" />
            <span className="capitalize">{today}</span>
          </div>
        )}

        <div className="flex items-center gap-6">
          <button className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 transition-all text-slate-600 border border-slate-100 shadow-sm hover:translate-y-[-2px]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#B91C1C] rounded-full border-2 border-white" />
          </button>
          
          <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 transition-all text-slate-600 border border-slate-100 shadow-sm hover:translate-y-[-2px]">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-6 pl-10 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-[#111827] leading-none mb-2">{userName}</p>
            <Badge variant="secondary" className="text-[10px] h-5 font-bold bg-[#14532D]/10 text-[#14532D] border-none uppercase tracking-wider">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#14532D] to-[#166534] p-[2px] shadow-2xl shadow-green-900/10 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-sm font-bold text-[#14532D]">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
