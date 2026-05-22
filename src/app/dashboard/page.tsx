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
      <div className="space-y-6 md:space-y-10 animate-fade-up">
        {/* Hero Section */}
        <div className="relative h-[250px] md:h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-classroom-working/1400/600"}
            alt="Élèves travaillant ensemble"
            fill
            priority
            className="object-cover transition-transform duration-1000 saturate-[1.6] brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-14 flex flex-col justify-center space-y-4 md:space-y-8">
            <div className="flex items-center gap-3 bg-primary text-white w-fit px-5 py-2 rounded-full text-[10px] md:text-sm font-black tracking-widest uppercase shadow-xl border border-white/20">
              <Sparkles className="w-4 h-4 text-accent" />
              Session 2023-2024
            </div>
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] leading-tight tracking-tighter">
                Espace <br className="hidden md:block"/><span className="text-primary">ACADEX</span>
              </h1>
              <p className="text-sm md:text-2xl text-[#0F172A] font-black max-w-lg leading-tight opacity-90">
                L'excellence est une habitude. <br/>Préparez le futur aujourd'hui.
              </p>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-18 px-8 md:px-14 rounded-2xl md:rounded-[2rem] shadow-2xl transition-all hover:translate-y-[-4px] text-xs md:text-xl flex items-center gap-4 border-4 border-white/20 w-full md:w-auto">
                Lancer la Session <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} delay="0.1s" />
          <StatCard title="Performance" value="--" trend="T1" icon={TrendingUp} delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl overflow-hidden p-0">
            <CardHeader className="p-6 md:p-12 flex flex-row items-center justify-between border-b-2 border-slate-50/50 bg-slate-50/30">
              <div>
                <CardTitle className="text-2xl md:text-5xl font-black text-[#0F172A] tracking-tighter">Suivi Académique</CardTitle>
                <CardDescription className="text-sm md:text-xl font-black text-[#0F172A] opacity-60">Analyse stratégique des résultats.</CardDescription>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-2xl shrink-0 rotate-3 border-4 border-white/10">
                <Activity className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[450px] p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:space-y-10">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-3xl md:rounded-[2.5rem] flex items-center justify-center border-4 border-slate-100 shadow-inner">
                 <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
              </div>
              <p className="text-base md:text-3xl text-[#0F172A] font-black max-w-md leading-tight">
                En attente des saisies de notes. <br/>
                <span className="text-slate-400 text-sm md:text-lg">Les graphiques apparaîtront ici.</span>
              </p>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-2xl overflow-hidden p-0 h-fit">
            <CardHeader className="p-6 md:p-10 border-b-4 border-primary/10 bg-primary/5">
              <CardTitle className="flex items-center gap-4 text-2xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8 p-6 md:p-10">
              <JournalEntry author="Système ACADEX" action="Version 2024 active" module="Système" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Définissez les coefficients" module="Gestion" time="En cours" />
              <JournalEntry author="Sécurité" action="Chiffrement activé" module="Sécurité" time="Actif" type="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type = "neutral", delay }: any) {
  return (
    <Card className="vivid-box group cursor-pointer animate-fade-up border-none p-6 md:p-10 shadow-2xl" style={{ animationDelay: delay }}>
      <div className="flex justify-between items-start">
        <div className="space-y-4 md:space-y-6 flex-1">
          <p className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
          <h3 className="text-4xl md:text-7xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{value}</h3>
          <div className={cn(
            "text-[9px] md:text-[11px] font-black px-4 py-1.5 rounded-full w-fit uppercase tracking-[0.2em] shadow-lg border-2 border-white/20",
            type === "warning" ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          )}>
            {trend}
          </div>
        </div>
        <div className={cn(
          "w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shrink-0 rotate-6 border-4 border-white/10 transition-transform group-hover:rotate-12",
          type === "warning" ? "bg-red-500" : "bg-primary"
        )}>
          <Icon className="w-5 h-5 md:w-8 md:h-8" />
        </div>
      </div>
    </Card>
  );
}

function JournalEntry({ author, action, time, type = "neutral" }: any) {
  return (
    <div className="flex gap-4 md:gap-6 items-start relative pb-6 md:pb-10 last:pb-0 group">
      <div className="absolute left-[9px] top-6 md:top-8 bottom-0 w-[3px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-4 h-4 md:w-5 md:h-5 rounded-full mt-2 md:mt-3 shrink-0 border-4 border-white shadow-xl relative z-10",
          type === "positive" ? "bg-primary" : "bg-slate-900"
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-lg font-black text-[#0F172A]">{author}</p>
          <span className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs md:text-base text-[#0F172A] font-black leading-tight opacity-70">{action}</p>
      </div>
    </div>
  );
}