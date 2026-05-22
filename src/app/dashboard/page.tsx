
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
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

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

  const distributionData = [
    { range: "0-8", count: 0, color: "#B91C1C" },
    { range: "8-12", count: 0, color: "#111827" },
    { range: "12-16", count: 0, color: "#16A34A" },
    { range: "16-20", count: 0, color: "#16A34A" },
  ];

  const chartConfig = {
    count: { label: "Élèves", color: "#16A34A" }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up">
        {/* Hero Section */}
        <div className="relative h-[350px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-200/50">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/600"}
            alt="Joie de l'apprentissage"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14532D]/95 via-[#14532D]/30 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-20 flex flex-col justify-center text-white space-y-4 md:space-y-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl w-fit px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase border border-white/20">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-accent" />
              Lancement de l'Année Académique
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold text-white leading-[1.1] drop-shadow-2xl">
                Bienvenue sur <span className="text-accent">ACADEX</span>
              </h1>
              <p className="text-base md:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-xl">
                "Apprendre aujourd’hui, réussir demain". L'excellence commence ici. Initialisez votre établissement.
              </p>
            </div>
            <div className="pt-4 md:pt-10">
              <Button className="bg-white hover:bg-slate-100 text-[#14532D] font-bold h-12 md:h-18 px-8 md:px-14 rounded-2xl shadow-2xl transition-all hover:translate-y-[-4px] text-sm md:text-xl flex items-center gap-4">
                Démarrer la Session <ArrowUpRight className="w-5 md:w-7 h-5 md:h-7" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Reset to 0 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          <StatCard title="Effectif Total" value="0" trend="Initial" icon={Users} type="neutral" delay="0s" />
          <StatCard title="Enseignants" value="0" trend="À inscrire" icon={GraduationCap} type="neutral" delay="0.1s" />
          <StatCard title="Taux Réussite" value="--" trend="Trimestre 1" icon={TrendingUp} type="neutral" delay="0.2s" />
          <StatCard title="Paiements" value="0%" trend="T1" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-8 md:p-12 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl md:text-3xl font-bold text-[#111827]">Performance T1</CardTitle>
                <CardDescription className="text-base">Aucune donnée d'évaluation disponible.</CardDescription>
              </div>
              <div className="p-4 rounded-2xl bg-accent/10">
                <Activity className="w-6 h-6 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="h-[280px] md:h-[400px] p-6 md:p-12 pt-0 flex items-center justify-center">
              <p className="text-slate-400 font-medium italic">En attente des premières saisies de notes...</p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="p-8 md:p-12 pb-4">
              <CardTitle className="flex items-center gap-4 text-xl md:text-3xl font-bold text-[#111827]">
                <Calendar className="w-7 h-7 text-[#16A34A]" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 md:space-y-10 p-8 md:p-12 pt-8">
              <JournalEntry author="Système ACADEX" action="Ouverture de la session 2023-2024" module="Système" time="Maintenant" type="positive" />
              <JournalEntry author="Administration" action="Veuillez provisionner les classes" module="Gestion" time="En attente" type="neutral" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type, delay }: any) {
  return (
    <Card className="premium-card group cursor-pointer animate-fade-up" style={{ animationDelay: delay }}>
      <CardContent className="p-8 md:p-10">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl md:text-5xl font-headline font-bold text-[#111827] group-hover:text-accent transition-colors">{value}</h3>
            <div className={cn(
              "text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-fit flex items-center gap-1",
              type === "positive" ? "bg-green-100 text-[#14532D]" : 
              type === "warning" ? "bg-red-100 text-[#B91C1C]" : "bg-slate-100 text-slate-500"
            )}>
              {trend}
            </div>
          </div>
          <div className={cn(
            "p-4 md:p-5 rounded-2xl text-white shadow-2xl transition-all duration-500 group-hover:rotate-6",
            type === "positive" ? "bg-[#16A34A]" : 
            type === "warning" ? "bg-[#B91C1C]" : "bg-[#111827]"
          )}>
            <Icon className="w-6 md:w-8 h-6 md:h-8" />
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
          "w-5 h-5 md:w-6 md:h-6 rounded-full mt-1.5 shrink-0 border-4 border-white shadow-xl transition-all group-hover:scale-125",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-[#16A34A]" : "bg-slate-400"
        )} 
      />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <p className={cn("text-base md:text-lg font-bold", type === "danger" ? "text-[#B91C1C]" : "text-[#111827]")}>{author}</p>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{action}</p>
      </div>
    </div>
  );
}
