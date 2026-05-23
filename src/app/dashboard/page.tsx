
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
import { Button } from "@/components/ui/button";
import { getRoleFromId } from "@/lib/utils";
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
      <div className="space-y-8 md:space-y-12 animate-fade-up max-w-[1440px] mx-auto overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-[250px] md:h-[450px] w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-classroom-working/1400/600"}
            alt="Élèves travaillant ensemble"
            fill
            priority
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105 saturate-[1.8] brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center space-y-4 md:space-y-8">
            <div className="flex items-center gap-3 bg-primary text-white w-fit px-4 md:px-7 py-2.5 md:py-3.5 rounded-full text-[9px] md:text-xs font-black tracking-[0.4em] uppercase shadow-2xl border-2 border-white/20">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              Session Académique {schoolConfig?.academicYear || "2026-2027"}
            </div>
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-3xl md:text-8xl font-headline font-black text-[#0F172A] leading-none tracking-tighter uppercase">
                Bienvenue à <br/><span className="text-primary">{schoolConfig?.name || "ACADEX"}</span>
              </h1>
              <p className="text-[11px] md:text-2xl text-[#0F172A] font-black max-w-2xl leading-tight opacity-90 italic tracking-tight">
                "{schoolConfig?.slogan || "L'excellence est une habitude. Préparez le futur aujourd'hui."}"
              </p>
            </div>
            <div className="pt-4">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-20 px-8 md:px-12 rounded-xl md:rounded-[2rem] shadow-2xl transition-all hover:translate-y-[-4px] text-[10px] md:text-xl flex items-center gap-5 border-4 border-white/20 w-full md:w-auto uppercase tracking-tighter">
                Lancer la Session <ArrowUpRight className="w-6 h-6 md:w-9 md:h-9" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <StatCard title="Effectif" value="--" trend="Initial" icon={Users} delay="0s" />
          <StatCard title="Profs" value="--" trend="À inscrire" icon={GraduationCap} delay="0.1s" />
          <StatCard title="Performance" value="--" trend="Attente T1" icon={TrendingUp} delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="Initial" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl overflow-hidden p-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/95 backdrop-blur-xl">
            <CardHeader className="p-8 md:p-14 flex flex-row items-center justify-between border-b-2 border-slate-50/50 bg-slate-50/20">
              <div>
                <CardTitle className="text-xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Suivi Stratégique</CardTitle>
                <CardDescription className="text-[9px] md:text-xl font-black text-primary opacity-60 uppercase tracking-[0.3em] mt-2 md:mt-4">Analyse temps réel • 2026-2027</CardDescription>
              </div>
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl shrink-0 rotate-3 border-2 border-white/10">
                <Activity className="w-9 h-9 md:w-12 md:h-12" />
              </div>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[400px] p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6 md:space-y-12">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center border-2 border-slate-100 shadow-inner group">
                 <Sparkles className="w-12 h-12 md:w-20 md:h-20 text-primary animate-pulse group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-2 md:space-y-4">
                <p className="text-sm md:text-3xl text-[#0F172A] font-black max-w-lg mx-auto leading-tight uppercase tracking-tighter">
                  Prêt pour les saisies de notes
                </p>
                <p className="text-slate-400 text-[9px] md:text-base font-black uppercase tracking-widest opacity-60">
                  Les analyses pédagogiques apparaîtront ici dès publication.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="vivid-box border-none shadow-2xl overflow-hidden p-0 h-fit rounded-[2.5rem] md:rounded-[3.5rem] bg-white/95 backdrop-blur-xl">
            <CardHeader className="p-8 md:p-10 border-b-4 border-primary/10 bg-primary/5">
              <CardTitle className="flex items-center gap-5 md:gap-7 text-xl md:text-3xl font-black text-[#0F172A] tracking-tighter uppercase">
                <Calendar className="w-9 h-9 md:w-12 md:h-12 text-primary" />
                Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-10 p-8 md:p-10">
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
    <Card className="vivid-box group cursor-pointer animate-fade-up border-none p-6 md:p-10 shadow-2xl rounded-[2rem] md:rounded-[3rem] bg-white/95 backdrop-blur-xl hover:scale-[1.02] transition-all" style={{ animationDelay: delay }}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-6 md:mb-10">
          <div className={cn(
            "w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 rotate-6 border-2 border-white/10 transition-transform group-hover:rotate-12",
            type === "warning" ? "bg-red-500" : "bg-primary"
          )}>
            <Icon className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <div className={cn(
            "text-[7px] md:text-[10px] font-black px-3 md:px-4 py-1 rounded-full uppercase tracking-widest shadow-md border border-white/20",
            type === "warning" ? "bg-red-500 text-white" : "bg-slate-900 text-white"
          )}>
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[7px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">{title}</p>
          <h3 className="text-xl md:text-5xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

function JournalEntry({ author, action, time, type = "neutral" }: any) {
  return (
    <div className="flex gap-5 md:gap-7 items-start relative pb-6 md:pb-10 last:pb-0 group">
      <div className="absolute left-[9px] md:left-[11px] top-8 md:top-12 bottom-0 w-[2px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-5 h-5 md:w-7 md:h-7 rounded-full mt-1.5 md:mt-2 shrink-0 border-2 border-white shadow-xl relative z-10",
          type === "positive" ? "bg-primary" : "bg-slate-900"
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-[10px] md:text-lg font-black text-[#0F172A] uppercase tracking-tighter">{author}</p>
          <span className="text-[6px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-[9px] md:text-[15px] text-[#0F172A] font-black leading-tight opacity-70 italic">"{action}"</p>
      </div>
    </div>
  );
}
