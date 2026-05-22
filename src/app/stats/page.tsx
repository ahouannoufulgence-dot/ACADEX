
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, Activity, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";
import { cn } from "@/lib/utils";

export default function StatisticsPage() {
  // Données pour l'évolution
  const evolutionData = [
    { month: "Jan", avg: 10.5, success: 85 },
    { month: "Fév", avg: 11.2, success: 88 },
    { month: "Mar", avg: 12.4, success: 92 },
    { month: "Avr", avg: 11.8, success: 90 },
  ];

  // Données pour la répartition par cycle
  const cycleData = [
    { name: "Lycée", value: 450, color: "#14532D" },
    { name: "Collège", value: 350, color: "#111827" },
    { name: "Primaire", value: 200, color: "#B91C1C" },
  ];

  // Données pour la répartition des notes (Trimestre en cours)
  const gradeDistributionData = [
    { name: "Excellence (>14)", value: 240, color: "#16A34A" },
    { name: "Réussite (10-14)", value: 480, color: "#111827" },
    { name: "Alerte (<10)", value: 122, color: "#B91C1C" },
  ];

  const chartConfig = {
    avg: { label: "Moyenne", color: "#14532D" },
    success: { label: "Taux de réussite", color: "#111827" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Analyses Décisionnelles</h1>
            <p className="text-slate-500 text-lg font-medium">Suivi de la performance globale de l'institution.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 text-xs font-bold text-[#14532D] shadow-sm animate-pulse">
                <Activity className="w-4 h-4 text-[#16A34A]" /> Données en temps réel
             </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatMiniCard label="Moyenne Générale" value="11.48" trend="+1.2" status="up" delay="0s" />
           <StatMiniCard label="Taux d'Admission" value="92.4%" trend="+4%" status="up" delay="0.1s" />
           <StatMiniCard label="Taux d'Abandon" value="0.8%" trend="-0.2" status="down" delay="0.2s" />
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="premium-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <TrendingUp className="w-6 h-6 text-[#14532D]" />
                Évolution des Résultats
              </CardTitle>
              <CardDescription>Moyenne pondérée des évaluations par mois.</CardDescription>
            </CardHeader>
            <CardContent className="h-[360px] p-8 pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94A3B8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      fontWeight={600}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 20]}
                      fontWeight={600}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="avg" 
                      fill="#14532D" 
                      radius={[8, 8, 0, 0]} 
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <Users className="w-6 h-6 text-[#111827]" />
                Répartition des Effectifs
              </CardTitle>
              <CardDescription>Distribution globale entre Lycée, Collège et Primaire.</CardDescription>
            </CardHeader>
            <CardContent className="h-[360px] p-8 pt-4 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cycleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-[#111827]">1000</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Grade Distribution */}
        <div className="grid grid-cols-1 gap-10">
          <Card className="premium-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <PieIcon className="w-6 h-6 text-[#B91C1C]" />
                Répartition des Notes par Trimestre
              </CardTitle>
              <CardDescription>Analyse de la performance académique du Trimestre 2.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-8 pt-4 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={140}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                    <span className="text-sm font-bold text-[#111827]">Excellence</span>
                  </div>
                  <span className="font-mono font-bold">240 élèves</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#111827]" />
                    <span className="text-sm font-bold text-[#111827]">Réussite</span>
                  </div>
                  <span className="font-mono font-bold">480 élèves</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#B91C1C]" />
                    <span className="text-sm font-bold text-[#111827]">Alerte</span>
                  </div>
                  <span className="font-mono font-bold">122 élèves</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ label, value, trend, status, delay }: any) {
  return (
    <Card className="premium-card p-8 animate-fade-up" style={{ animationDelay: delay }}>
       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-4xl font-headline font-bold text-[#111827]">{value}</p>
          <Badge className={cn(
            "text-[10px] font-bold px-4 py-1 border-none",
            status === 'up' ? "bg-green-100 text-[#14532D]" : "bg-red-100 text-[#B91C1C]"
          )} variant="outline">
             {trend}
          </Badge>
       </div>
    </Card>
  );
}
