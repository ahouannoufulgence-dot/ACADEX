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
    { range: "0-8", count: 45, color: "#B91C1C" },
    { range: "8-12", count: 120, color: "#111827" },
    { range: "12-16", count: 240, color: "#16A34A" },
    { range: "16-20", count: 85, color: "#16A34A" },
  ];

  const chartConfig = {
    count: { label: "Élèves", color: "#16A34A" }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-up">
        {/* Hero Section - Vibrant & Joyful */}
        <div className="relative h-[480px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/600"}
            alt="Joie de l'apprentissage"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14532D]/95 via-[#14532D]/40 to-transparent" />
          <div className="absolute inset-0 p-16 lg:p-20 flex flex-col justify-center text-white space-y-8">
            <div className="flex items-center gap-3 bg-accent/20 backdrop-blur-2xl w-fit px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-white/30 animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
              Excellence Académique & Joie d'Apprendre
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-headline font-bold text-white leading-tight drop-shadow-2xl">
                Bienvenue sur <span className="text-accent">ACADEX</span>
              </h1>
              <p className="text-2xl text-white/95 font-medium max-w-3xl leading-relaxed drop-shadow-xl">
                "Apprendre aujourd’hui, réussir demain". Gérez votre établissement avec la précision du futur.
              </p>
            </div>
            <div className="pt-8">
              <Button className="bg-white hover:bg-slate-100 text-[#14532D] font-bold h-16 px-12 rounded-[1.5rem] shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg">
                Rapport d'Excellence du Jour <ArrowUpRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Vibrant Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Effectif Total" value="842" trend="+12% vs 2023" icon={Users} type="neutral" delay="0s" />
          <StatCard title="Enseignants" value="48" trend="98% connectés" icon={GraduationCap} type="neutral" delay="0.1s" />
          <StatCard title="Taux de Réussite" value="88%" trend="+5.2 pts" icon={TrendingUp} type="positive" delay="0.2s" />
          <StatCard title="Paiements T2" value="72%" trend="Recouvrement" icon={CreditCard} type="warning" delay="0.3s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Performance Académique</CardTitle>
                <CardDescription className="text-lg">Répartition des moyennes trimestrielles</CardDescription>
              </div>
              <Activity className="w-6 h-6 text-accent" />
            </CardHeader>
            <CardContent className="h-[380px] p-10 pt-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 600}} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={55}>
                      {distributionData.map((entry, index) => (
                        <rect key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-[#111827]">
                <Calendar className="w-6 h-6 text-[#16A34A]" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-10 pt-6">
              <JournalEntry author="Conseil de Classe" action="Tle D - Salle de réunion" module="Urgent" time="15:00" type="danger" />
              <JournalEntry author="M. Kouassi" action="Saisie des notes MATH" module="Notes" time="09:42" type="neutral" />
              <JournalEntry author="Administration" action="Clôture inscriptions T2" module="Finance" time="Hier" type="danger" />
              <JournalEntry author="Cantine" action="Menu spécial scolaire" module="Vie Scolaire" time="12:00" type="positive" />
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
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</p>
            <h3 className="text-4xl font-headline font-bold text-[#111827] group-hover:text-accent transition-colors">{value}</h3>
            <p className={cn(
              "text-xs font-bold px-3 py-1 rounded-full w-fit",
              type === "positive" ? "bg-green-100 text-[#14532D]" : 
              type === "warning" ? "bg-red-100 text-[#B91C1C]" : "bg-slate-100 text-slate-500"
            )}>
              {trend}
            </p>
          </div>
          <div className={cn(
            "p-4 rounded-2xl transition-all duration-500 shadow-xl",
            type === "positive" ? "bg-[#16A34A] text-white group-hover:scale-110" : 
            type === "warning" ? "bg-[#B91C1C] text-white group-hover:scale-110" : "bg-[#111827] text-white group-hover:scale-110"
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
    <div className="flex gap-6 items-start relative pb-8 last:pb-0 group">
      <div className="absolute left-[9px] top-7 bottom-0 w-[2px] bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-5 h-5 rounded-full mt-1.5 shrink-0 border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-150",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-[#16A34A]" : "bg-slate-400"
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className={cn("text-base font-bold", type === "danger" ? "text-[#B91C1C]" : "text-[#111827]")}>{author}</p>
          <span className="text-xs text-slate-400 font-bold">{time}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{action}</p>
        <Badge variant="outline" className={cn(
          "mt-3 text-[10px] font-bold h-6 tracking-widest uppercase px-3 transition-all",
          type === "danger" ? "border-[#B91C1C]/40 text-[#B91C1C] bg-[#B91C1C]/5" : "border-slate-200 text-slate-500 bg-slate-50"
        )}>
          {module}
        </Badge>
      </div>
    </div>
  );
}