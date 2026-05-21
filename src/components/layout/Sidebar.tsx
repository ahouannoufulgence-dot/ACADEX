"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  ShieldAlert,
  LogOut,
  ChevronRight,
  ClipboardList,
  BarChart3,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/auth-utils";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

export const Sidebar = ({ role, userName }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem("acadex_user");
    router.push("/login");
  };

  const getNavItems = () => {
    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Messagerie", href: "/messages", icon: MessageSquare },
    ];

    if (role === "DIRECTOR") {
      return [
        ...commonItems,
        { name: "Gestion des Accès", href: "/access-management", icon: KeyRound },
        { name: "Élèves", href: "/students", icon: GraduationCap },
        { name: "Enseignants", href: "/teachers", icon: Users },
        { name: "Classes", href: "/classes", icon: ClipboardList },
        { name: "Emploi du temps", href: "/schedule", icon: Calendar },
        { name: "Notes & Résultats", href: "/grades", icon: FileText },
        { name: "Paiements", href: "/payments", icon: CreditCard },
        { name: "Statistiques", href: "/stats", icon: BarChart3 },
        { name: "Sécurité", href: "/security", icon: ShieldAlert },
        { name: "Paramètres", href: "/settings", icon: Settings },
      ];
    }

    if (role === "TEACHER") {
      return [
        ...commonItems,
        { name: "Mes Classes", href: "/my-classes", icon: ClipboardList },
        { name: "Saisie Notes", href: "/grades/entry", icon: FileText },
        { name: "Absences", href: "/absences", icon: ShieldAlert },
        { name: "Agenda", href: "/agenda", icon: Calendar },
      ];
    }

    return [
      ...commonItems,
      { name: "Mes Notes", href: "/grades/my", icon: FileText },
      { name: "Bulletin", href: "/report-card", icon: BookOpen },
      { name: "Emploi du temps", href: "/schedule", icon: Calendar },
      { name: "Mes Paiements", href: "/payments/my", icon: CreditCard },
      { name: "Absences", href: "/absences", icon: ShieldAlert },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col border-r border-sidebar-border fixed left-0 top-0 z-40">
      <div className="p-6 pb-2">
        <Link href="/dashboard" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-white font-headline font-bold text-xl tracking-tight">ACADEX</h1>
            <p className="text-accent text-[10px] font-bold uppercase tracking-widest">Premium School</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1 pb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-accent")} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};