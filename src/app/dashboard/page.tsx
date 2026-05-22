"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight,
  Calendar,
  Sparkles,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRoleFromId } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function DashboardPage() {
  const [role, setRole] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("acadex_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(getRoleFromId(user.id));
    }
  }, []);

  if (!role || !mounted) return null;

  const heroImage = PlaceHolderImages.find(img => img.id === "dashboard-hero");

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        {/* Hero Section - Elite Clear Edition */}
        <div className="relative h-[300px] md:h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-100 bg-white">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/600"}
            alt="Joie de l'apprentissage"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 bg-[#14532D]/10 backdrop-blur-md w-fit px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#14532D] border border-[#14532D]/10">
              <Sparkles className="w-4 h-4" />
              Session 2023-2024 Lancée
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold text-[#111827] leading-tight tracking-tighter">
                Espace <span className="text-[#14532D]">ACADEX</span>
              </h1>
              <p className="text-base md:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed">
                Initialisation réussie. Préparez le terrain pour une année d'excellence.
              </p>
            </div>
            <div className="pt-6">
              <Button className="bg-[#14532D] hover:bg-[#1a6b3a] text-white font-bold h-14 md:h-16 px-10 md:px-12 rounded-2xl shadow-xl transition-all hover:translate-y-[-4px] text-base md:text-lg flex items-center gap-4">
                Lancer la Session <ArrowUpRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Reset for new year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} type="neutral" delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} type="neutral" delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Trimestre 1" icon={TrendingUp} type="neutral" delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <Card className="lg:col-span-2 premium-card border-none shadow-xl bg-white">
            <CardHeader className="p-8 md:p-10 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#111827]">Suivi Académique</CardTitle>
                <CardDescription className="text-base">Analyse des premières évaluations à venir.</CardDescription>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Activity className="w-6 h-6 text-[#14532D]" />
              </div>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[350px] p-6 md:p-10 pt-0 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                 <Sparkles className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium italic">En attente des premières saisies de notes par les enseignants.</p>
            </CardContent>
          </Card>

          <Card className="premium-card border-none shadow-xl bg-white">
            <CardHeader className="p-8 md:p-10 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-[#111827]">
                <Calendar className="w-6 h-6 text-[#14532D]" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8 md:p-10 pt-6">
              <JournalEntry author="Système ACADEX" action="Déploiement de la version 2024" module="Système" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Veuillez définir les coefficients" module="Gestion" time="En cours" type="neutral" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type, delay }: any) {
  return (
    <Card className="premium-card group cursor-pointer animate-fade-up bg-white border-none shadow-lg" style={{ animationDelay: delay }}>
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl md:text-4xl font-headline font-bold text-[#111827] group-hover:text-[#14532D] transition-colors">{value}</h3>
            <div className={cn(
              "text-[9px] font-bold px-3 py-1 rounded-full w-fit uppercase tracking-tighter",
              type === "positive" ? "bg-green-100 text-[#14532D]" : 
              type === "warning" ? "bg-red-50 text-[#B91C1C]" : "bg-slate-100 text-slate-500"
            )}>
              {trend}
            </div>
          </div>
          <div className={cn(
            "p-4 rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6",
            type === "warning" ? "bg-[#B91C1C]" : "bg-[#14532D]"
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, type }: any) {
  return (
    <div className="flex gap-4 items-start relative pb-8 last:pb-0 group">
      <div className="absolute left-[9px] top-6 bottom-0 w-[1px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-4 h-4 rounded-full mt-1.5 shrink-0 border-2 border-white shadow-md transition-all group-hover:scale-125",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-[#14532D]" : "bg-slate-300"
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-bold text-[#111827]">{author}</p>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">{action}</p>
      </div>
    </div>
  );
}
