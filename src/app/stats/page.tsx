"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function StatisticsPage() {
  const data = [
    { month: "Jan", avg: 10.5, success: 85 },
    { month: "Fév", avg: 11.2, success: 88 },
    { month: "Mar", avg: 12.4, success: 92 },
    { month: "Avr", avg: 11.8, success: 90 },
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
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">Analyses Décisionnelles</h1>
            <p className="text-slate-500 font-medium">Suivi de la performance globale de l'institution.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500 shadow-sm">
                <Activity className="w-4 h-4 text-[#14532D]" /> Temps réel
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatMiniCard label="Moyenne Générale" value="11.48" trend="+1.2" status="up" />
           <StatMiniCard label="Taux d'Admission" value="92.4%" trend="+4%" status="up" />
           <StatMiniCard label="Taux d'Abandon" value="0.8%" trend="-0.2" status="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="premium-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-lg font-bold">
                <TrendingUp className="w-5 h-5 text-[#14532D]" />
                Évolution des Résultats Mensuels
              </CardTitle>
              <CardDescription>Moyenne pondérée des évaluations par mois.</CardDescription>
            </CardHeader>
            <CardContent className="h-[340px] pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94A3B8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      fontWeight={600}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 20]}
                      fontWeight={600}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="avg" 
                      fill="var(--color-avg)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-lg font-bold">
                <Users className="w-5 h-5 text-[#111827]" />
                Distribution des Effectifs par Cycle
              </CardTitle>
              <CardDescription>Répartition des inscriptions validées.</CardDescription>
            </CardHeader>
            <CardContent className="h-[340px] pt-4">
              <div className="flex h-full items-end gap-6 px-8 pb-10">
                <div className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full bg-[#14532D]/10 rounded-xl h-[85%] flex items-end justify-center pb-4 text-[11px] font-bold text-[#14532D] border border-[#14532D]/5">45%</div>
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-widest">Lycée</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full bg-[#111827]/10 rounded-xl h-[65%] flex items-end justify-center pb-4 text-[11px] font-bold text-[#111827] border border-[#111827]/5">35%</div>
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-widest">Collège</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full bg-[#14532D]/20 rounded-xl h-[45%] flex items-end justify-center pb-4 text-[11px] font-bold text-[#14532D] border border-[#14532D]/5">20%</div>
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-widest">Primaire</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ label, value, trend, status }: any) {
  return (
    <Card className="premium-card p-6">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-3xl font-headline font-bold text-[#111827]">{value}</p>
          <Badge className={status === 'up' ? "bg-green-50 text-[#14532D] border-green-100" : "bg-red-50 text-[#B91C1C] border-red-100"} variant="outline">
             {trend}
          </Badge>
       </div>
    </Card>
  )
}
