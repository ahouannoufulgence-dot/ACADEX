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
        <div className="relative h-[400px] md:h-[550px] w-full rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.15)] group border border-white bg-white">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/600"}
            alt="Joie de l'apprentissage"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
          <div className="absolute inset-0 p-10 md:p-20 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 bg-primary/10 backdrop-blur-xl w-fit px-8 py-3 rounded-full text-xs md:text-sm font-black tracking-[0.2em] uppercase text-primary border border-primary/20 shadow-lg">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              Session 2023-2024 Lancée
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-headline font-black text-[#0F172A] leading-[0.9] tracking-tighter">
                Espace <br/><span className="text-primary">ACADEX</span>
              </h1>
              <p className="text-lg md:text-3xl text-slate-600 font-bold max-w-2xl leading-relaxed">
                Initialisation réussie. Préparez le terrain pour une année d'excellence.
              </p>
            </div>
            <div className="pt-8">
              <Button className="bg-primary hover:bg-primary/90 text-white font-black h-16 md:h-20 px-12 md:px-16 rounded-[2rem] shadow-[0_20px_60px_rgba(20,83,45,0.4)] transition-all hover:translate-y-[-8px] text-lg md:text-2xl flex items-center gap-6">
                Lancer la Session <ArrowUpRight className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Reset for new year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} type="neutral" delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} type="neutral" delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Trimestre 1" icon={TrendingUp} type="neutral" delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-10 md:p-12 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black text-[#0F172A] tracking-tighter">Suivi Académique</CardTitle>
                <CardDescription className="text-lg font-medium text-slate-500">Analyse des premières évaluations à venir.</CardDescription>
              </div>
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 shadow-inner">
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[450px] p-10 md:p-16 pt-0 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border-4 border-slate-100 shadow-inner">
                 <Sparkles className="w-12 h-12 text-slate-200" />
              </div>
              <p className="text-xl text-slate-400 font-bold italic max-w-sm">En attente des premières saisies de notes par les enseignants.</p>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-10 md:p-12 pb-6">
              <CardTitle className="flex items-center gap-4 text-3xl font-black text-[#0F172A] tracking-tighter">
                <Calendar className="w-8 h-8 text-primary" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-10 md:p-12 pt-8">
              <JournalEntry author="Système ACADEX" action="Déploiement de la version 2024" module="Système" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Veuillez définir les coefficients" module="Gestion" time="En cours" type="neutral" />
              <JournalEntry author="Sécurité" action="Chiffrement des accès activé" module="Sécurité" time="Actif" type="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type, delay }: any) {
  return (
    <Card className="vivid-box group cursor-pointer animate-fade-up bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)]" style={{ animationDelay: delay }}>
      <CardContent className="p-10">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-5xl md:text-6xl font-headline font-black text-[#0F172A] group-hover:text-primary transition-colors tracking-tighter">{value}</h3>
            <div className={cn(
              "text-[10px] font-black px-4 py-1.5 rounded-full w-fit uppercase tracking-wider shadow-sm",
              type === "positive" ? "bg-green-100 text-[#14532D]" : 
              type === "warning" ? "bg-red-50 text-[#B91C1C]" : "bg-slate-100 text-slate-500"
            )}>
              {trend}
            </div>
          </div>
          <div className={cn(
            "p-6 rounded-[1.5rem] text-white shadow-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
            type === "warning" ? "bg-[#B91C1C]" : "bg-primary"
          )}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, type }: any) {
  return (
    <div className="flex gap-6 items-start relative pb-10 last:pb-0 group">
      <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-6 h-6 rounded-full mt-1.5 shrink-0 border-4 border-white shadow-xl transition-all group-hover:scale-150",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-primary" : "bg-slate-300"
        )} 
      />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-base font-black text-[#0F172A]">{author}</p>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm text-slate-500 font-bold leading-relaxed">{action}</p>
      </div>
    </div>
  );
}