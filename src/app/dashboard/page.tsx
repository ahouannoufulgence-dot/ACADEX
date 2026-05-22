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
        {/* Hero Section - Elite Responsive */}
        <div className="relative h-[300px] md:h-[500px] w-full rounded-[24px] overflow-hidden shadow-xl border-4 border-white bg-slate-100">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-classroom-working/1400/600"}
            alt="Élèves travaillant ensemble"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[1.6] brightness-110"
            data-ai-hint="students classroom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center space-y-4 md:space-y-8">
            <div className="flex items-center gap-2 bg-primary text-white w-fit px-6 py-2 rounded-full text-[10px] md:text-sm font-black tracking-widest uppercase shadow-lg border-2 border-white/10">
              <Sparkles className="w-4 h-4 text-accent" />
              Session 2023-2024
            </div>
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-4xl md:text-7xl font-headline font-black text-[#0F172A] leading-none tracking-tighter">
                Espace <br/><span className="text-primary text-5xl md:text-8xl">ACADEX</span>
              </h1>
              <p className="text-sm md:text-2xl text-[#0F172A] font-black max-w-xl leading-tight opacity-80">
                Initialisation réussie. Préparez le terrain pour une année d'excellence.
              </p>
            </div>
            <div className="pt-4">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-20 px-8 md:px-12 rounded-2xl shadow-xl transition-all hover:translate-y-[-4px] text-sm md:text-xl flex items-center gap-4 border-2 border-white/10">
                Lancer la Session <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Standardized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Trimestre 1" icon={TrendingUp} delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="lg:col-span-2 vivid-box border-none shadow-xl bg-white overflow-hidden p-0">
            <CardHeader className="p-6 md:p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">Suivi Académique</CardTitle>
                <CardDescription className="text-sm md:text-base font-black text-slate-500">Analyse des premières évaluations.</CardDescription>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[400px] p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100">
                 <Sparkles className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-lg md:text-xl text-[#0F172A] font-black max-w-xs">En attente des premières saisies de notes.</p>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-xl bg-white overflow-hidden p-0">
            <CardHeader className="p-6 md:p-8 border-b-2 border-slate-50">
              <CardTitle className="flex items-center gap-4 text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">
                <Calendar className="w-6 h-6 text-primary" />
                Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 md:p-8">
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
    <Card className="vivid-box group cursor-pointer animate-fade-up bg-white border-none p-6" style={{ animationDelay: delay }}>
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-4xl md:text-5xl font-headline font-black text-[#0F172A] tracking-tighter">{value}</h3>
          <div className={cn(
            "text-[9px] font-black px-4 py-1 rounded-full w-fit uppercase tracking-widest shadow-sm",
            type === "warning" ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          )}>
            {trend}
          </div>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
          type === "warning" ? "bg-red-500" : "bg-primary"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

function JournalEntry({ author, action, time, type = "neutral" }: any) {
  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0 group">
      <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-4 h-4 rounded-full mt-1.5 shrink-0 border-2 border-white shadow-md",
          type === "positive" ? "bg-primary" : "bg-slate-900"
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-black text-[#0F172A]">{author}</p>
          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs text-[#0F172A] font-black leading-tight">{action}</p>
      </div>
    </div>
  );
}