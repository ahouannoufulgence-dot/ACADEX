
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
  const evolutionData = [
    { month: "Jan", avg: 10.5, success: 85 },
    { month: "Fév", avg: 11.2, success: 88 },
    { month: "Mar", avg: 12.4, success: 92 },
    { month: "Avr", avg: 11.8, success: 90 },
  ];

  const cycleData = [
    { name: "Lycée", value: 450, color: "#14532D" },
    { name: "Collège", value: 350, color: "#111827" },
    { name: "Primaire", value: 200, color: "#B91C1C" },
  ];

  const gradeDistributionData = [
    { name: "Excellence", value: 240, color: "#16A34A" },
    { name: "Réussite", value: 480, color: "#111827" },
    { name: "Alerte", value: 122, color: "#B91C1C" },
  ];

  const chartConfig = {
    avg: { label: "Moyenne", color: "#14532D" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-[#111827] mb-2 tracking-tight">Analyses Décisionnelles</h1>
            <p className="text-slate-500 text-base md:text-xl font-medium">Performance globale de l'institution en temps réel.</p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-bold text-[#14532D] shadow-xl animate-pulse">
            <Activity className="w-5 h-5 text-[#16A34A]" /> Monitoring Actif
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
           <StatMiniCard label="Moyenne Générale" value="11.48" trend="+1.2" status="up" delay="0s" />
           <StatMiniCard label="Admission" value="92.4%" trend="+4%" status="up" delay="0.1s" />
           <StatMiniCard label="Abandon" value="0.8%" trend="-0.2" status="down" delay="0.2s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <Card className="premium-card">
            <CardHeader className="p-8 md:p-12 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#14532D]" /> Évolution des Moyennes
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[400px] p-6 md:p-12 pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} fontWeight={600} />
                    <YAxis stroke="#94A3B8" fontSize={12} fontWeight={600} domain={[0, 20]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avg" fill="#14532D" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="p-8 md:p-12 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-[#14532D]" /> Effectifs par Cycle
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[400px] p-6 md:p-12 pt-4 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cycleData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="85%"
                    paddingAngle={8}
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
                <span className="text-3xl md:text-5xl font-bold text-[#111827]">1000</span>
                <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-[0.2em]">Total Élèves</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="p-8 md:p-12 pb-4">
            <div className="flex items-center gap-4">
               <div className="p-4 rounded-2xl bg-red-50">
                  <PieIcon className="w-8 h-8 text-[#B91C1C]" />
               </div>
               <div>
                  <CardTitle className="text-xl md:text-2xl font-bold">Répartition de la Performance</CardTitle>
                  <CardDescription className="text-base">Analyse qualitative des résultats par catégorie d'excellence.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="min-h-[400px] p-8 md:p-12 pt-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 h-[300px] md:h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
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
              {gradeDistributionData.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-sm hover:translate-x-2 transition-transform cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-[#111827]">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm font-black text-[#14532D]">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ label, value, trend, status, delay }: any) {
  return (
    <Card className="premium-card p-8 md:p-10 animate-fade-up" style={{ animationDelay: delay }}>
       <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-3xl md:text-5xl font-headline font-bold text-[#111827]">{value}</p>
          <Badge className={cn(
            "text-[10px] md:text-xs font-bold px-4 py-1.5 border-none shadow-sm",
            status === 'up' ? "bg-green-100 text-[#14532D]" : "bg-red-100 text-[#B91C1C]"
          )} variant="outline">
             {trend}
          </Badge>
       </div>
    </Card>
  );
}
