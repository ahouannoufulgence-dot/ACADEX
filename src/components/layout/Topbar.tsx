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
    <header className="h-22 bg-white sticky top-0 z-30 flex items-center justify-between px-10 border-b border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
          <Input 
            placeholder="Rechercher un dossier, une note, un ID..." 
            className="pl-14 bg-slate-50 border-none h-13 rounded-xl focus-visible:ring-1 focus-visible:ring-[#14532D] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {mounted && (
          <div className="hidden xl:flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100">
            <CalendarIcon className="w-4 h-4 text-[#14532D]" />
            <span className="capitalize">{today}</span>
          </div>
        )}

        <div className="flex items-center gap-5">
          <button className="relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors text-slate-600 border border-transparent hover:border-slate-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#B91C1C] rounded-full border-2 border-white" />
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors text-slate-600 border border-transparent hover:border-slate-100">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-5 pl-8 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#111827] leading-none mb-1.5">{userName}</p>
            <Badge variant="secondary" className="text-[9px] h-4.5 font-bold bg-[#14532D]/10 text-[#14532D] border-none uppercase tracking-tighter">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#14532D] to-[#166534] p-0.5 shadow-xl shadow-green-900/10">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-sm font-bold text-[#14532D]">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
