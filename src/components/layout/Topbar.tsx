"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, Settings, HelpCircle, Calendar as CalendarIcon } from "lucide-react";
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
    <header className="h-20 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-border">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input 
            placeholder="Rechercher un élève, une classe, un document..." 
            className="pl-10 bg-muted/30 border-none h-11 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {mounted && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground mr-4">
            <CalendarIcon className="w-4 h-4 text-accent" />
            <span className="capitalize">{today}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <HelpCircle className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-bold text-foreground leading-none mb-1">{userName}</p>
            <Badge variant="secondary" className="text-[10px] h-4 font-bold bg-primary/10 text-primary border-none">
              {getRoleName(role)}
            </Badge>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
