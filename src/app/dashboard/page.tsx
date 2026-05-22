
"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function DashboardPage() {
  const [role, setRole] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();

  const schoolConfigRef = useMemo(() => (db ? doc(db, "config", "school") : null), [db]);
  const { data: schoolConfig } = useDoc(schoolConfigRef);

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
      <div className="space-y-6 md:space-y-8 animate-fade-up max-w-[1440px] mx-auto overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-[250px] md:h-[400px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-classroom-working/1400/600"}
            alt="Élèves travaillant ensemble"
            fill
            priority
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105 saturate-[1.8] brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center space-y-3 md:space-y-6">
            <div className="flex items-center gap-2 bg-primary text-white w-fit px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl border-2 border-white/20">
              <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5 text-accent" />
              Session Académique {schoolConfig?.academicYear || "2026-2027"}
            </div>
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] leading-none tracking-tighter uppercase">
                Bienvenue à <br/><span className="text-primary">{schoolConfig?.name || "ACADEX"}</span>
              </h1>
              <p className="text-[10px] md:text-xl text-[#0F172A] font-black max-w-lg leading-tight opacity-90 italic tracking-tight">
                "{schoolConfig?.slogan || "L'excellence est une habitude. Préparez le futur aujourd'hui."}"
              </p>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-2xl transition-all hover:translate-y-[-4px] text-[9px] md:text-lg flex items-center gap-3 border-4 border-white/20 w-full md:w-auto uppercase tracking-tighter">
                Lancer la Session <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <StatCard title="Effectif" value="--" trend="Initial" icon={Users} delay="0s" />
          <StatCard title="Profs" value="--" trend="À inscrire" icon={GraduationCap} delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Attente T1" icon={TrendingUp} delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="Initial" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl overflow-hidden p-0 rounded-[2rem] md:rounded-[2.5rem] bg-white/95 backdrop-blur-xl">
            <CardHeader className="p-6 md:p-10 flex flex-row items-center justify-between border-b-2 border-slate-50/50 bg-slate-50/20">
              <div>
                <CardTitle className="text-lg md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Suivi Stratégique</CardTitle>
                <CardDescription className="text-[8px] md:text-lg font-black text-primary opacity-60 uppercase tracking-[0.2em] mt-1 md:mt-2">Analyse temps réel • 2026-2027</CardDescription>
              </div>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary text-white flex items-center justify-center shadow-2xl shrink-0 rotate-3 border-2 border-white/10">
                <Activity className="w-5 h-5 md:w-7 md:h-7" />
              </div>
            </CardHeader>
            <CardContent className="h-[200px] md:h-[350px] p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-4 md:space-y-8">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-inner group">
                 <Sparkles className="w-8 h-8 md:w-14 md:h-14 text-primary animate-pulse group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-2xl text-[#0F172A] font-black max-w-md mx-auto leading-tight uppercase tracking-tighter">
                  Prêt pour les saisies de notes
                </p>
                <p className="text-slate-400 text-[8px] md:text-sm font-black uppercase tracking-widest opacity-60">
                  Les analyses pédagogiques apparaîtront ici dès publication.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-2xl overflow-hidden p-0 h-fit rounded-[2rem] md:rounded-[2.5rem] bg-white/95 backdrop-blur-xl">
            <CardHeader className="p-6 md:p-8 border-b-4 border-primary/10 bg-primary/5">
              <CardTitle className="flex items-center gap-3 md:gap-4 text-lg md:text-2xl font-black text-[#0F172A] tracking-tighter uppercase">
                <Calendar className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 md:space-y-8 p-6 md:p-8">
              <JournalEntry author={schoolConfig?.name || "ACADEX"} action="Session 2026-2027 active" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Configuration Elite prête" time="1h" />
              <JournalEntry author="Sécurité" action="Chiffrement renforcé" time="2h" type="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type = "neutral", delay }: any) {
  return (
    <Card className="vivid-box group cursor-pointer animate-fade-up border-none p-4 md:p-8 shadow-2xl rounded-[1.5rem] md:rounded-[2rem] bg-white/95 backdrop-blur-xl hover:scale-[1.02] transition-all" style={{ animationDelay: delay }}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className={cn(
            "w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl shrink-0 rotate-6 border-2 border-white/10 transition-transform group-hover:rotate-12",
            type === "warning" ? "bg-red-500" : "bg-primary"
          )}>
            <Icon className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div className={cn(
            "text-[6px] md:text-[8px] font-black px-2 md:px-3 py-0.5 rounded-full uppercase tracking-widest shadow-md border border-white/20",
            type === "warning" ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          )}>
            {trend}
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-[6px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
          <h3 className="text-lg md:text-3xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

function JournalEntry({ author, action, time, type = "neutral" }: any) {
  return (
    <div className="flex gap-4 md:gap-5 items-start relative pb-5 md:pb-8 last:pb-0 group">
      <div className="absolute left-[7px] md:left-[9px] top-6 md:top-9 bottom-0 w-[1.5px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-3.5 h-3.5 md:w-5 md:h-5 rounded-full mt-1 md:mt-1.5 shrink-0 border-2 border-white shadow-xl relative z-10",
          type === "positive" ? "bg-primary" : "bg-slate-900"
        )} 
      />
      <div className="flex-1 space-y-0.5">
        <div className="flex justify-between items-center">
          <p className="text-[8px] md:text-sm font-black text-[#0F172A] uppercase tracking-tighter">{author}</p>
          <span className="text-[5px] md:text-[8px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-[7px] md:text-[11px] text-[#0F172A] font-black leading-tight opacity-70 italic">"{action}"</p>
      </div>
    </div>
  );
}
