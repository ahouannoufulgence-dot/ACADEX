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
        <div className="relative h-[360px] w-full rounded-2xl overflow-hidden shadow-sm group border border-slate-200">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-joy/1200/400"}
            alt="Joyful high school students"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint="happy African students"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 p-12 flex flex-col justify-center text-white space-y-5">
            <div className="flex items-center gap-2 bg-[#14532D] w-fit px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3 h-3 text-white" />
              Excellence Académique
            </div>
            <h1 className="text-5xl lg:text-6xl font-headline font-bold tracking-tight">
              Bienvenue sur ACADEX
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-2xl leading-relaxed">
              "Apprendre aujourd’hui, réussir demain." Pilotez votre établissement avec la précision et la sérénité du haut de gamme.
            </p>
            <div className="pt-6">
              <Button className="w-fit bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 px-10 rounded-xl shadow-lg transition-all hover:translate-y-[-2px]">
                Voir le tableau de bord <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Effectif Total" value="842" trend="+12% cette année" icon={Users} status="positive" />
          <StatCard title="Enseignants" value="48" trend="96% de présence" icon={GraduationCap} status="neutral" />
          <StatCard title="Taux de Réussite" value="88%" trend="+5.2 pts" icon={TrendingUp} status="positive" />
          <StatCard title="Paiements" value="72%" trend="Recouvrement T2" icon={CreditCard} status="positive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart Card */}
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-xl font-bold text-[#111827]">Répartition des Performances</CardTitle>
                <CardDescription>Nombre d'élèves par tranche de moyenne</CardDescription>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <TrendingUp className="w-6 h-6 text-[#14532D]" />
              </div>
            </CardHeader>
            <CardContent className="h-[340px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="range" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
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
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-[#111827]">
                <Calendar className="w-6 h-6 text-[#14532D]" />
                Agenda du Jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
    <Card className="premium-card group cursor-pointer">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-headline font-bold text-[#111827]">{value}</h3>
            </div>
            <p className={cn(
              "text-[10px] font-bold flex items-center gap-1",
              status === "positive" ? "text-[#14532D]" : 
              status === "warning" ? "text-[#B91C1C]" : "text-slate-500"
            )}>
              {status === "positive" && <ArrowUpRight className="w-3 h-3" />}
              {trend}
            </p>
          </div>
          <div className={cn(
            "p-4 rounded-2xl border transition-all",
            status === "positive" ? "bg-green-50/50 border-green-100 text-[#14532D]" : 
            status === "warning" ? "bg-red-50/50 border-red-100 text-[#B91C1C]" : "bg-slate-50 border-slate-100 text-slate-400"
          )}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalEntry({ author, action, module, time, color }: any) {
  return (
    <div className="flex gap-5 items-start relative pb-8 last:pb-0">
      <div className="absolute left-[7px] top-7 bottom-0 w-[1px] bg-slate-100 last:hidden" />
      <div 
        className="w-4 h-4 rounded-full mt-1.5 shrink-0 border-[3px] border-white shadow-sm" 
        style={{ backgroundColor: color }} 
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-bold text-[#111827]">{author}</p>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{action}</p>
        <Badge variant="outline" className="mt-2.5 text-[8px] font-bold h-5 tracking-widest uppercase px-2 border-slate-200 text-slate-400">
          {module}
        </Badge>
      </div>
    </div>
  );
}
