
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users } from "lucide-react";
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
    avg: { label: "Moyenne", color: "#1A6B4A" },
    success: { label: "Taux de réussite", color: "#1F2937" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-2">Statistiques & Analyses</h1>
          <p className="text-slate-500 font-medium">Analyse visuelle de la performance globale de l'établissement.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-[#1F2937] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1A6B4A]" />
                Moyenne Générale Mensuelle
              </CardTitle>
              <CardDescription>Évolution des résultats au cours du trimestre.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94A3B8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 20]}
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
            <CardHeader>
              <CardTitle className="text-[#1F2937] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1A6B4A]" />
                Répartition des Élèves par Cycle
              </CardTitle>
              <CardDescription>Distribution des effectifs totaux.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <div className="flex h-full items-end gap-4 px-4 pb-8">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#1A6B4A]/10 rounded-t-lg h-[80%] flex items-end justify-center pb-2 text-[10px] font-bold text-[#1A6B4A]">45%</div>
                  <span className="text-xs font-bold text-slate-500">Lycée</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#1F2937]/10 rounded-t-lg h-[60%] flex items-end justify-center pb-2 text-[10px] font-bold text-[#1F2937]">35%</div>
                  <span className="text-xs font-bold text-slate-500">Collège</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#1A6B4A]/20 rounded-t-lg h-[40%] flex items-end justify-center pb-2 text-[10px] font-bold text-[#1A6B4A]">20%</div>
                  <span className="text-xs font-bold text-slate-500">Primaire</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
