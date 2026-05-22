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
  KeyRound,
  Home,
  BookMarked,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/auth-utils";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

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
      { name: "Accueil", href: "/dashboard", icon: Home },
      { name: "Messagerie", href: "/messages", icon: MessageSquare },
      { name: "Agenda", href: "/agenda", icon: Calendar },
    ];

    if (role === "DIRECTOR") {
      return [
        ...commonItems,
        { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
        { name: "Élèves", href: "/students", icon: GraduationCap },
        { name: "Enseignants", href: "/teachers", icon: Users },
        { name: "Classes", href: "/classes", icon: ClipboardList },
        { name: "Matières", href: "/settings", icon: BookMarked },
        { name: "Emploi du temps", href: "/schedule", icon: Calendar },
        { name: "Notes & Résultats", href: "/grades", icon: FileText },
        { name: "Absences", href: "/absences", icon: ShieldAlert },
        { name: "Paiements", href: "/payments", icon: CreditCard },
        { name: "Statistiques", href: "/stats", icon: BarChart3 },
        { name: "Rapports", href: "/report-card", icon: FileCheck },
        { name: "Génération Accès", href: "/access-management", icon: KeyRound },
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
    <aside className="w-64 h-screen bg-gradient-to-b from-[#14532D] to-[#111827] flex flex-col fixed left-0 top-0 z-40 border-r border-white/5">
      <div className="p-10 pb-8 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-[#14532D] font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-white font-headline font-bold text-xl tracking-tight leading-tight">ACADEX</h1>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">High End System</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 sidebar-scroll px-5">
        <nav className="space-y-1.5 pb-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name + item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-30" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-8 border-t border-white/10 bg-black/20 shrink-0">
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-destructive/10 hover:text-destructive transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
