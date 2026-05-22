"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";
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
  ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

export default function StatisticsPage() {
  const data = [
    { month: "Jan", avg: 10.5, success: 85 },
    { month: "Fév", avg: 11.2, success: 88 },
    { month: "Mar", avg: 12.4, success: 92 },
    { month: "Avr", avg: 11.8, success: 90 },
  ];

  const chartConfig = {
    avg: { label: "Moyenne", color: "#16A34A" },
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
                <Activity className="w-4 h-4 text-[#16A34A]" /> Temps réel
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatMiniCard label="Moyenne Générale" value="11.48" trend="+1.2" status="up" delay="0s" />
           <StatMiniCard label="Taux d'Admission" value="92.4%" trend="+4%" status="up" delay="0.1s" />
           <StatMiniCard label="Taux d'Abandon" value="0.8%" trend="-0.2" status="down" delay="0.2s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="premium-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <TrendingUp className="w-6 h-6 text-[#16A34A]" />
                Évolution des Résultats
              </CardTitle>
              <CardDescription>Moyenne pondérée des évaluations par mois.</CardDescription>
            </CardHeader>
            <CardContent className="h-[360px] p-8 pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
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
                      fill="#16A34A" 
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
                Répartition par Cycle
              </CardTitle>
              <CardDescription>Effectifs validés session 2024.</CardDescription>
            </CardHeader>
            <CardContent className="h-[360px] p-8 pt-4">
              <div className="flex h-full items-end gap-8 px-4 pb-8">
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-[#16A34A]/20 rounded-2xl h-[85%] flex items-end justify-center pb-5 text-sm font-bold text-[#14532D] border border-[#16A34A]/10 transition-all group-hover:bg-[#16A34A]/30">45%</div>
                  <span className="text-[10px] font-bold text-[#111827] uppercase tracking-widest">Lycée</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-[#111827]/10 rounded-2xl h-[65%] flex items-end justify-center pb-5 text-sm font-bold text-[#111827] border border-[#111827]/5 transition-all group-hover:bg-[#111827]/20">35%</div>
                  <span className="text-[10px] font-bold text-[#111827] uppercase tracking-widest">Collège</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-accent/20 rounded-2xl h-[45%] flex items-end justify-center pb-5 text-sm font-bold text-[#16A34A] border border-accent/10 transition-all group-hover:bg-accent/30">20%</div>
                  <span className="text-[10px] font-bold text-[#111827] uppercase tracking-widest">Primaire</span>
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
  )
}