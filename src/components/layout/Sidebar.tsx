
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  ShieldAlert,
  LogOut,
  ClipboardList,
  BarChart3,
  KeyRound,
  Home,
  FileCheck,
  X,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/auth-utils";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

interface SidebarProps {
  role: UserRole;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ role, userName, isOpen, onClose }: SidebarProps) => {
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

  const navItems = [
    { name: "Accueil", href: "/dashboard", icon: Home, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Messagerie", href: "/messages", icon: MessageSquare, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Agenda", href: "/agenda", icon: Calendar, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Élèves", href: "/students", icon: GraduationCap, roles: ['DIRECTOR'] },
    { name: "Enseignants", href: "/teachers", icon: Users, roles: ['DIRECTOR'] },
    { name: "Classes", href: "/classes", icon: ClipboardList, roles: ['DIRECTOR'] },
    { name: "Contrôle Notes", href: "/grades", icon: ShieldCheck, roles: ['DIRECTOR'] },
    { name: "Paiements", href: "/payments", icon: CreditCard, roles: ['DIRECTOR'] },
    { name: "Statistiques", href: "/stats", icon: BarChart3, roles: ['DIRECTOR'] },
    { name: "Génération Accès", href: "/access-management", icon: KeyRound, roles: ['DIRECTOR'] },
    { name: "Sécurité", href: "/security", icon: ShieldAlert, roles: ['DIRECTOR'] },
    { name: "Mes Classes", href: "/my-classes", icon: ClipboardList, roles: ['TEACHER'] },
    { name: "Saisie Notes", href: "/grades/entry", icon: FileText, roles: ['TEACHER'] },
    { name: "Mes Notes", href: "/grades/my", icon: FileText, roles: ['STUDENT_PARENT'] },
    { name: "Bulletin", href: "/report-card", icon: FileCheck, roles: ['STUDENT_PARENT'] },
    { name: "Mes Paiements", href: "/payments/my", icon: CreditCard, roles: ['STUDENT_PARENT'] },
    { name: "Emploi du temps", href: "/schedule", icon: Calendar, roles: ['DIRECTOR', 'STUDENT_PARENT'] },
    { name: "Absences", href: "/absences", icon: ShieldAlert, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Paramètres", href: "/settings", icon: Settings, roles: ['DIRECTOR'] },
  ].filter(item => item.roles.includes(role));

  return (
    <aside className={cn(
      "w-64 h-screen bg-[#14532D] flex flex-col fixed left-0 top-0 z-40 border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-8 pb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-[#14532D] font-bold text-lg">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-headline font-bold text-lg leading-tight tracking-tight">ACADEX</span>
            <span className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em]">Management Elite</span>
          </div>
        </div>
        <button className="lg:hidden text-white/60 hover:text-white" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 sidebar-scroll px-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-white/15 text-white shadow-sm ring-1 ring-white/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && <div className="w-1 h-4 bg-white/30 rounded-full" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5 bg-black/10">
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-xs">
            {userName.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-bold">Quitter</span>
        </button>
      </div>
    </aside>
  );
};
