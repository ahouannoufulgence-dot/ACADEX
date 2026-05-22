
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
  Line,
  LineChart,
  ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";

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

  // Chart data matching the restricted color scheme (Green, Black, Red)
  const performanceData = [
    { name: "Trim 1", value: 11.2 },
    { name: "Trim 2", value: 12.4 },
    { name: "Trim 3", value: 13.8 },
  ];

  const distributionData = [
    { range: "0-8", count: 45, color: "#DC2626" },   // Red: Alert
    { range: "8-12", count: 120, color: "#1F2937" }, // Black: Neutral
    { range: "12-16", count: 240, color: "#1A6B4A" }, // Green: Good
    { range: "16-20", count: 85, color: "#1A6B4A" },  // Green: Excellent
  ];

  const chartConfig = {
    value: { label: "Performance", color: "#1A6B4A" },
    count: { label: "Élèves", color: "#1F2937" }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Hero Section */}
        <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/acadex-hero/1200/400"}
            alt="Smiling African students"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            data-ai-hint="African students"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 p-8 flex flex-col justify-center text-white space-y-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full text-xs font-bold ring-1 ring-white/20">
              <Sparkles className="w-3 h-3 text-accent" />
              Session 2023/2024
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
              Bienvenue, {role === 'DIRECTOR' ? 'Directeur' : 'Enseignant'}
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-xl">
              "Apprendre aujourd’hui, réussir demain." Pilotez votre établissement avec précision et élégance.
            </p>
            <Button className="w-fit bg-accent hover:bg-accent/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-accent/20">
              Voir le rapport du jour <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Effectif Total" value="842" trend="+12%" icon={Users} status="positive" />
          <StatCard title="Enseignants" value="48" trend="96% Prés." icon={GraduationCap} status="neutral" />
          <StatCard title="Paiements" value="72%" trend="Recouvrement" icon={CreditCard} status="positive" />
          <StatCard title="Absences" value="14" trend="Aujourd'hui" icon={AlertCircle} status="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart Card */}
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#1F2937]">Progression Académique</CardTitle>
                <CardDescription>Moyenne générale par trimestre</CardDescription>
              </div>
              <div className="p-2 bg-[#F5F7F9] rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#1A6B4A]" />
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Calendar className="w-5 h-5 text-[#1A6B4A]" />
                Agenda du Jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <JournalEntry author="Conseil de Classe" action="3ème D - Salle de réunion" module="Réunion" time="15:00" color="#1A6B4A" />
              <JournalEntry author="M. Kossou" action="Saisie des notes MATH" module="Notes" time="09:42" color="#1F2937" />
              <JournalEntry author="Administration" action="Clôture inscriptions T2" module="Urgent" time="18:00" color="#DC2626" />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="premium-card border-l-4 border-l-[#DC2626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#DC2626]">
                <AlertCircle className="w-4 h-4" /> Alertes Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertItem title="5 enseignants absents sans justificatif" date="Depuis 8h00" status="critical" />
              <AlertItem title="Reste à recouvrer : 4.2M FCFA" date="Trimestre 2" status="warning" />
            </CardContent>
          </Card>

          <Card className="premium-card border-l-4 border-l-[#1A6B4A]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1A6B4A]">
                <CheckCircle2 className="w-4 h-4" /> Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertItem title="Bulletin du T1 publiés" date="Hier" status="success" />
              <AlertItem title="12 nouveaux accès élèves provisionnés" date="Aujourd'hui" status="success" />
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
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-headline font-bold text-[#1F2937]">{value}</h3>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                status === "positive" ? "bg-[#1A6B4A]/10 text-[#1A6B4A]" : 
                status === "warning" ? "bg-[#DC2626]/10 text-[#DC2626]" : "bg-slate-100 text-slate-500"
              )}>
                {trend}
              </span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl transition-all group-hover:scale-110",
            status === "positive" ? "bg-[#1A6B4A]/5 text-[#1A6B4A]" : 
            status === "warning" ? "bg-[#DC2626]/5 text-[#DC2626]" : "bg-slate-50 text-slate-400"
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ title, date, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F9] hover:bg-white transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-1.5 h-8 rounded-full",
          status === "critical" ? "bg-[#DC2626]" : 
          status === "warning" ? "bg-amber-400" : "bg-[#1A6B4A]"
        )} />
        <div>
          <p className="text-sm font-bold text-[#1F2937]">{title}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{date}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  );
}

function JournalEntry({ author, action, module, time, color }: any) {
  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0">
      <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-slate-100 last:hidden" />
      <div 
        className="w-4 h-4 rounded-full mt-1 shrink-0 border-2 border-white shadow-sm" 
        style={{ backgroundColor: color }} 
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-bold text-[#1F2937]">{author}</p>
          <span className="text-[10px] font-bold text-slate-400">{time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">{action}</p>
        <Badge variant="outline" className="mt-2 text-[8px] font-bold h-4 tracking-tighter uppercase px-1.5">
          {module}
        </Badge>
      </div>
    </div>
  );
}
