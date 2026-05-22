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
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-10 border-b border-slate-100">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
          <Input 
            placeholder="Rechercher par dossier ou ID..." 
            className="pl-12 bg-slate-50 border-none h-11 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-[#14532D]/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {mounted && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5 text-[#14532D]" />
            {today}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-100 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#111827] leading-none mb-1.5">{userName}</p>
            <Badge variant="outline" className="text-[9px] h-4 font-bold bg-[#14532D]/5 text-[#14532D] border-none uppercase tracking-tighter">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-[#14532D] shadow-inner ring-1 ring-slate-100">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
