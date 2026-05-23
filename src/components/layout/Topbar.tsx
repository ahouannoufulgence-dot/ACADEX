
"use client";

import React, { useEffect, useState } from "react";
import { Search, Menu, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserRole, getRoleName } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  role: UserRole;
  userName: string;
  onMenuClick: () => void;
  academicYear?: string;
}

export const Topbar = ({ role, userName, onMenuClick, academicYear = "2026-2027" }: TopbarProps) => {
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
    <header className="h-16 md:h-24 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 border-b border-slate-100">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-10 h-10" />
        </button>
        
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-12 h-14 rounded-xl text-[14px] font-black text-[#0F172A] focus-visible:ring-1 focus-visible:ring-[#0F172A]/10 border-none bg-slate-50 uppercase tracking-widest placeholder:opacity-30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Badge variant="outline" className="hidden lg:flex items-center gap-3 border-2 border-primary/20 bg-primary/5 text-primary font-black px-5 h-14 rounded-xl text-[11px] uppercase tracking-widest shadow-sm">
          <Sparkles className="w-8 h-8 text-accent" /> {academicYear}
        </Badge>

        <div className="flex items-center gap-3 md:gap-5 pl-3 md:pl-5 border-l border-slate-100 ml-1">
          <div className="text-right hidden md:block">
            <p className="text-[14px] font-black text-[#0F172A] leading-none mb-1 uppercase tracking-tighter">{userName}</p>
            <Badge variant="outline" className="text-[9px] h-5 px-3 font-black bg-[#0F172A] text-white border-none uppercase tracking-tighter rounded-md">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-900 flex items-center justify-center text-[14px] font-black text-white shadow-xl ring-2 ring-white/10">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
