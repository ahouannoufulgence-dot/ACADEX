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
    <header className="h-20 bg-white sticky top-0 z-30 flex items-center justify-between px-8 border-b border-border shadow-sm">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F2937] opacity-40 group-focus-within:text-[#1A6B4A] group-focus-within:opacity-100 transition-all" />
          <Input 
            placeholder="Rechercher un élève, une classe, un document..." 
            className="pl-10 bg-[#F5F7F9] border-none h-11 focus-visible:ring-1 focus-visible:ring-[#1A6B4A] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {mounted && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-[#1F2937]/60 mr-4">
            <CalendarIcon className="w-4 h-4 text-[#1A6B4A]" />
            <span className="capitalize">{today}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#F5F7F9] hover:bg-[#F5F7F9]/80 transition-colors">
            <Bell className="w-5 h-5 text-[#1F2937]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white" />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F5F7F9] hover:bg-[#F5F7F9]/80 transition-colors">
            <HelpCircle className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-bold text-[#1F2937] leading-none mb-1">{userName}</p>
            <Badge variant="secondary" className="text-[10px] h-4 font-bold bg-[#1A6B4A]/10 text-[#1A6B4A] border-none">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A6B4A] to-[#1A6B4A]/60 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#1A6B4A]">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
