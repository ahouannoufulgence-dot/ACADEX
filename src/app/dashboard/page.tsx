
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
    { range: "12-16", count: 240, color: "#14532D" },
    { range: "16-20", count: 85, color: "#14532D" },
  ];

  const chartConfig = {
    count: { label: "Élèves", color: "#14532D" }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        {/* Hero Section - Joyful background */}
        <div className="relative h-[420px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1200/600"}
            alt="Joie de l'apprentissage"
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14532D]/95 via-[#14532D]/40 to-transparent" />
          <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-center text-white space-y-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl w-fit px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              Excellence Académique & Joie d'Apprendre
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-7xl font-headline font-bold text-white leading-tight drop-shadow-lg">
                Bienvenue sur ACADEX
              </h1>
              <p className="text-xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-md">
                "Apprendre aujourd’hui, réussir demain". Gérez votre établissement avec la précision du futur.
              </p>
            </div>
            <div className="pt-6">
              <Button className="bg-white hover:bg-slate-50 text-[#14532D] font-bold h-14 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                Rapport d'Excellence du Jour <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Effectif Total" value="842" trend="+12% vs 2023" icon={Users} type="neutral" />
          <StatCard title="Enseignants" value="48" trend="98% connectés" icon={GraduationCap} type="neutral" />
          <StatCard title="Taux de Réussite" value="88%" trend="+5.2 pts" icon={TrendingUp} type="positive" />
          <StatCard title="Paiements T2" value="72%" trend="Recouvrement" icon={CreditCard} type="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-[#111827]">Performance Académique</CardTitle>
                <CardDescription>Répartition des moyennes trimestrielles</CardDescription>
              </div>
              <Activity className="w-5 h-5 text-slate-300" />
            </CardHeader>
            <CardContent className="h-[320px] p-8 pt-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
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
            <CardHeader className="p-8 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-[#111827]">
                <Calendar className="w-5 h-5 text-[#14532D]" />
                Journal de Bord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-4">
              <JournalEntry author="Conseil de Classe" action="Tle D - Salle de réunion" module="Urgent" time="15:00" type="danger" />
              <JournalEntry author="M. Kouassi" action="Saisie des notes MATH" module="Notes" time="09:42" type="neutral" />
              <JournalEntry author="Administration" action="Clôture inscriptions T2" module="Finance" time="Hier" type="danger" />
              <JournalEntry author="Cantine" action="Menu spécial" module="Vie Scolaire" time="12:00" type="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, type }: any) {
  return (
    <Card className="premium-card group cursor-pointer hover:border-[#14532D]/30">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-headline font-bold text-[#111827]">{value}</h3>
            <p className={cn(
              "text-xs font-bold",
              type === "positive" ? "text-[#14532D]" : 
              type === "warning" ? "text-[#B91C1C]" : "text-slate-500"
            )}>
              {trend}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300 shadow-sm",
            type === "positive" ? "bg-[#14532D]/10 text-[#14532D]" : 
            type === "warning" ? "bg-[#B91C1C]/10 text-[#B91C1C]" : "bg-slate-50 text-slate-400"
          )}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, type }: any) {
  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0">
      <div className="absolute left-[7px] top-6 bottom-0 w-px bg-slate-100 last:hidden" />
      <div 
        className={cn(
          "w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 border-2 border-white shadow-sm",
          type === "danger" ? "bg-[#B91C1C]" : type === "positive" ? "bg-[#14532D]" : "bg-slate-300"
        )} 
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className={cn("text-sm font-bold", type === "danger" ? "text-[#B91C1C]" : "text-[#111827]")}>{author}</p>
          <span className="text-[10px] text-slate-400 font-medium">{time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">{action}</p>
        <Badge variant="outline" className={cn(
          "mt-2 text-[8px] font-bold h-4 tracking-tighter uppercase px-1.5",
          type === "danger" ? "border-[#B91C1C]/30 text-[#B91C1C] bg-[#B91C1C]/5" : "border-slate-200 text-slate-500"
        )}>
          {module}
        </Badge>
      </div>
    </div>
  );
}
