"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Sparkles
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
        {/* Hero Section */}
        <div className="relative h-[420px] w-full rounded-[2rem] overflow-hidden shadow-2xl group border border-white/10">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy/1200/400"}
            alt="Joyful high school students"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 p-16 flex flex-col justify-center text-white space-y-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20">
              <Sparkles className="w-3 h-3 text-white" />
              Excellence Académique
            </div>
            <h1 className="text-6xl lg:text-7xl font-headline font-bold tracking-tight">
              Bienvenue sur ACADEX
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
              "Apprendre aujourd’hui, réussir demain." Pilotez votre établissement avec la précision et la sérénité du haut de gamme.
            </p>
            <div className="pt-8">
              <Button className="w-fit bg-[#14532D] hover:bg-[#166534] text-white font-bold h-16 px-12 rounded-2xl shadow-2xl shadow-green-900/40 transition-all hover:translate-y-[-4px] active:scale-95 text-lg">
                Voir le tableau de bord <ArrowUpRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Effectif Total" value="842" trend="+12% cette année" icon={Users} status="positive" />
          <StatCard title="Enseignants" value="48" trend="96% de présence" icon={GraduationCap} status="neutral" />
          <StatCard title="Taux de Réussite" value="88%" trend="+5.2 pts" icon={TrendingUp} status="positive" />
          <StatCard title="Paiements" value="72%" trend="Recouvrement T2" icon={CreditCard} status="positive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Performance Chart Card */}
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="flex flex-row items-center justify-between p-10 pb-4">
              <div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Répartition des Performances</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Nombre d'élèves par tranche de moyenne</CardDescription>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <TrendingUp className="w-7 h-7 text-[#14532D]" />
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-10 pt-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="range" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontSize: 13, fontWeight: 600}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontSize: 13, fontWeight: 600}} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
                      {distributionData.map((entry, index) => (
                        <rect key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Activity/Agenda Card */}
          <Card className="premium-card">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-[#111827]">
                <Calendar className="w-7 h-7 text-[#14532D]" />
                Agenda du Jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-10 pt-4">
              <JournalEntry author="Conseil de Classe" action="3ème D - Salle de réunion" module="Urgent" time="15:00" color="#14532D" />
              <JournalEntry author="M. Kouassi" action="Saisie des notes MATH" module="Notes" time="09:42" color="#111827" />
              <JournalEntry author="Administration" action="Clôture inscriptions T2" module="Finance" time="18:00" color="#B91C1C" />
              <JournalEntry author="Cantine Scolaire" action="Menu spécial fête" module="Vie Scolaire" time="12:00" color="#14532D" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, icon: Icon, status }: any) {
  return (
    <Card className="premium-card group cursor-pointer border-none shadow-xl">
      <CardContent className="p-10">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-headline font-bold text-[#111827]">{value}</h3>
            </div>
            <p className={cn(
              "text-xs font-bold flex items-center gap-1.5",
              status === "positive" ? "text-[#14532D]" : 
              status === "warning" ? "text-[#B91C1C]" : "text-slate-500"
            )}>
              {status === "positive" && <ArrowUpRight className="w-4 h-4" />}
              {trend}
            </p>
          </div>
          <div className={cn(
            "p-5 rounded-3xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
            status === "positive" ? "bg-green-50/80 border-green-100 text-[#14532D]" : 
            status === "warning" ? "bg-red-50/80 border-red-100 text-[#B91C1C]" : "bg-slate-50 border-slate-100 text-slate-400"
          )}>
            <Icon className="w-9 h-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, color }: any) {
  return (
    <div className="flex gap-6 items-start relative pb-10 last:pb-0">
      <div className="absolute left-[9px] top-8 bottom-0 w-[1.5px] bg-slate-100 last:hidden" />
      <div 
        className="w-5 h-5 rounded-full mt-2 shrink-0 border-4 border-white shadow-xl" 
        style={{ backgroundColor: color }} 
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-base font-bold text-[#111827]">{author}</p>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{time}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{action}</p>
        <Badge variant="outline" className="mt-3 text-[9px] font-bold h-6 tracking-widest uppercase px-3 border-slate-200 text-slate-400 bg-white">
          {module}
        </Badge>
      </div>
    </div>
  );
}
