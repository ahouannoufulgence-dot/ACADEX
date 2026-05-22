
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
      <div className="space-y-12 animate-fade-up">
        {/* Hero Section - Elite Vivid Edition */}
        <div className="relative h-[450px] md:h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.4)] group border-4 border-white bg-slate-100">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-classroom-working/1400/600"}
            alt="Élèves travaillant ensemble"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[1.6] brightness-110"
            data-ai-hint="students classroom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          <div className="absolute inset-0 p-12 md:p-24 flex flex-col justify-center space-y-8 md:space-y-10">
            <div className="flex items-center gap-4 bg-primary text-white w-fit px-10 py-4 rounded-full text-sm md:text-base font-black tracking-[0.25em] uppercase shadow-2xl border-2 border-white/20">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              Session 2023-2024 Lancée
            </div>
            <div className="space-y-6">
              <h1 className="text-6xl md:text-9xl font-headline font-black text-[#0F172A] leading-[0.85] tracking-tighter">
                Espace <br/><span className="text-primary">ACADEX</span>
              </h1>
              <p className="text-xl md:text-4xl text-[#0F172A] font-black max-w-2xl leading-tight">
                Initialisation réussie. Préparez le terrain pour une année d'excellence.
              </p>
            </div>
            <div className="pt-10">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-20 md:h-24 px-16 md:px-20 rounded-[2.5rem] shadow-[0_30px_80px_rgba(20,83,45,0.6)] transition-all hover:translate-y-[-10px] text-xl md:text-3xl flex items-center gap-8 border-4 border-white/10">
                Lancer la Session <ArrowUpRight className="w-10 h-10" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Reset for new year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} type="neutral" delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} type="neutral" delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Trimestre 1" icon={TrendingUp} type="neutral" delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-12 md:p-14 pb-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-4xl font-black text-[#0F172A] tracking-tighter">Suivi Académique</CardTitle>
                <CardDescription className="text-xl font-black text-slate-500 mt-2">Analyse des premières évaluations à venir.</CardDescription>
              </div>
              <div className="p-6 rounded-[2rem] bg-primary text-white shadow-2xl rotate-3">
                <Activity className="w-10 h-10" />
              </div>
            </CardHeader>
            <CardContent className="h-[350px] md:h-[500px] p-12 md:p-20 pt-0 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-slate-100 shadow-inner">
                 <Sparkles className="w-16 h-16 text-slate-200" />
              </div>
              <p className="text-2xl text-[#0F172A] font-black max-w-sm">En attente des premières saisies de notes.</p>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-12 md:p-14 pb-8 border-b-4 border-slate-50">
              <CardTitle className="flex items-center gap-6 text-4xl font-black text-[#0F172A] tracking-tighter">
                <Calendar className="w-10 h-10 text-primary" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-12 p-12 md:p-14 pt-10">
              <JournalEntry author="Système ACADEX" action="Version 2024 active" module="Système" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Définissez les coefficients" module="Gestion" time="En cours" type="neutral" />
              <JournalEntry author="Sécurité" action="Chiffrement activé" module="Sécurité" time="Actif" type="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type, delay }: any) {
  return (
    <Card className="vivid-box group cursor-pointer animate-fade-up bg-white border-none" style={{ animationDelay: delay }}>
      <CardContent className="p-12">
        <div className="flex justify-between items-start">
          <div className="space-y-6">
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{title}</p>
            <h3 className="text-6xl md:text-7xl font-headline font-black text-[#0F172A] group-hover:text-primary transition-colors tracking-tighter">{value}</h3>
            <div className={cn(
              "text-xs font-black px-6 py-2 rounded-full w-fit uppercase tracking-widest shadow-lg",
              type === "positive" ? "bg-accent text-white" : 
              type === "warning" ? "bg-[#B91C1C] text-white" : "bg-slate-900 text-white"
            )}>
              {trend}
            </div>
          </div>
          <div className={cn(
            "p-8 rounded-[2rem] text-white shadow-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
            type === "warning" ? "bg-[#B91C1C]" : "bg-primary"
          )}>
            <Icon className="w-10 h-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, type }: any) {
  return (
    <div className="flex gap-8 items-start relative pb-12 last:pb-0 group">
      <div className="absolute left-[13px] top-10 bottom-0 w-[4px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-8 h-8 rounded-full mt-1.5 shrink-0 border-4 border-white shadow-2xl transition-all group-hover:scale-125",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-primary" : "bg-slate-900"
        )} 
      />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-xl font-black text-[#0F172A]">{author}</p>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-lg text-[#0F172A] font-black leading-tight">{action}</p>
      </div>
    </div>
  );
}
