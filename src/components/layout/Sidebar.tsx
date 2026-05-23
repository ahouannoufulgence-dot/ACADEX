
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  GraduationCap, 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  CreditCard, 
  BarChart3, 
  KeyRound, 
  ShieldAlert, 
  Settings, 
  FileText, 
  FileCheck, 
  LogOut, 
  X,
  Clock,
  History
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
  schoolName?: string;
}

export const Sidebar = ({ role, userName, isOpen, onClose, schoolName = "ACADEX" }: SidebarProps) => {
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
    { name: "Horaire de cours", href: "/schedule", icon: Clock, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Élèves", href: "/students", icon: GraduationCap, roles: ['DIRECTOR'] },
    { name: "Enseignants", href: "/teachers", icon: Users, roles: ['DIRECTOR'] },
    { name: "Classes", href: "/classes", icon: ClipboardList, roles: ['DIRECTOR'] },
    { name: "Contrôle Notes", href: "/grades", icon: ShieldCheck, roles: ['DIRECTOR'] },
    { name: "Paiements", href: "/payments", icon: CreditCard, roles: ['DIRECTOR'] },
    { name: "Statistiques", href: "/stats", icon: BarChart3, roles: ['DIRECTOR'] },
    { name: "Archives", href: "/archives", icon: History, roles: ['DIRECTOR'] },
    { name: "Génération Accès", href: "/access-management", icon: KeyRound, roles: ['DIRECTOR'] },
    { name: "Sécurité", href: "/security", icon: ShieldAlert, roles: ['DIRECTOR'] },
    { name: "Mes Classes", href: "/my-classes", icon: ClipboardList, roles: ['TEACHER'] },
    { name: "Saisie Notes", href: "/grades/entry", icon: FileText, roles: ['TEACHER'] },
    { name: "Mes Notes", href: "/grades/my", icon: FileText, roles: ['STUDENT_PARENT'] },
    { name: "Bulletin", href: "/report-card", icon: FileCheck, roles: ['STUDENT_PARENT'] },
    { name: "Mes Paiements", href: "/payments/my", icon: CreditCard, roles: ['STUDENT_PARENT'] },
    { name: "Absences", href: "/absences", icon: ShieldAlert, roles: ['DIRECTOR', 'TEACHER', 'STUDENT_PARENT'] },
    { name: "Paramètres", href: "/settings", icon: Settings, roles: ['DIRECTOR'] },
  ].filter(item => item.roles.includes(role));

  return (
    <aside className={cn(
      "w-64 h-screen bg-[#14532D] flex flex-col fixed left-0 top-0 z-40 border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-2xl shrink-0 rotate-3 border-4 border-white/10">
            <span className="text-[#14532D] font-black text-2xl">{schoolName[0].toUpperCase()}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-headline font-black text-lg leading-tight tracking-tighter uppercase truncate">{schoolName}</span>
            <span className="text-white/50 text-[8px] font-black uppercase tracking-[0.3em]">Management Elite</span>
          </div>
        </div>
        <button className="lg:hidden text-white/60 hover:text-white" onClick={onClose}>
          <X className="w-10 h-10" />
        </button>
      </div>

      <div className="flex-1 sidebar-scroll px-4 mt-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-white/20 text-white shadow-xl ring-2 ring-white/10 scale-[1.02]" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-8 h-8 transition-all duration-300", isActive ? "text-white scale-110" : "text-white/40 group-hover:text-white group-hover:scale-110")} />
                  <span className="text-[14px] font-black uppercase tracking-tighter">{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-6 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t-4 border-white/5 bg-black/20">
        <div className="flex items-center gap-4 mb-6 px-1">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-inner border-2 border-white/5">
            {userName.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-black text-white truncate uppercase tracking-tighter">{userName}</p>
            <p className="text-[9px] text-accent uppercase font-black tracking-widest">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full h-12 flex items-center gap-4 px-4 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all group font-black uppercase tracking-widest text-[11px]"
        >
          <LogOut className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span>Quitter</span>
        </button>
      </div>
    </aside>
  );
};
