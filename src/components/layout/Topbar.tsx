
"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, Calendar as CalendarIcon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserRole, getRoleName } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  role: UserRole;
  userName: string;
  onMenuClick: () => void;
}

export const Topbar = ({ role, userName, onMenuClick }: TopbarProps) => {
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
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 border-b border-slate-100">
      <div className="flex items-center gap-3 flex-1">
        <button 
          className="lg:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 bg-slate-50 border-none h-10 rounded-xl text-[13px] focus-visible:ring-1 focus-visible:ring-[#14532D]/10"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {mounted && (
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            <CalendarIcon className="w-3 h-3 text-[#14532D]" />
            {today}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4 pl-3 md:pl-5 border-l border-slate-100 ml-1">
          <div className="text-right hidden md:block">
            <p className="text-[13px] font-black text-[#111827] leading-none mb-1">{userName}</p>
            <Badge variant="outline" className="text-[8px] h-3.5 px-1.5 font-black bg-[#14532D]/5 text-[#14532D] border-none uppercase tracking-tighter">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#14532D] shadow-inner ring-1 ring-slate-100">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
