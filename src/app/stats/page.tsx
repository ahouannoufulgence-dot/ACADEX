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
  CartesianGrid
} from "recharts";

export default function StatisticsPage() {
  const data = [
    { month: "Jan", avg: 10.5, success: 85 },
    { month: "Fév", avg: 11.2, success: 88 },
    { month: "Mar", avg: 12.4, success: 92 },
    { month: "Avr", avg: 11.8, success: 90 },
  ];

  const chartConfig = {
    avg: { label: "Moyenne", color: "hsl(var(--accent))" },
    success: { label: "Taux de réussite", color: "hsl(var(--primary))" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Statistiques & Analyses</h1>
          <p className="text-muted-foreground">Analyse visuelle de la performance globale de l'établissement.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Moyenne Générale Mensuelle
              </CardTitle>
              <CardDescription>Évolution des résultats au cours du trimestre.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#ffffff60" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#ffffff60" 
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
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Répartition des Élèves par Cycle
              </CardTitle>
              <CardDescription>Distribution des effectifs totaux.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <div className="flex h-full items-end gap-4 px-4 pb-8">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary/20 rounded-t-lg h-[80%] flex items-end justify-center pb-2 text-[10px] font-bold">45%</div>
                  <span className="text-xs font-bold text-muted-foreground">Lycée</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-accent/20 rounded-t-lg h-[60%] flex items-end justify-center pb-2 text-[10px] font-bold">35%</div>
                  <span className="text-xs font-bold text-muted-foreground">Collège</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-500/20 rounded-t-lg h-[40%] flex items-end justify-center pb-2 text-[10px] font-bold">20%</div>
                  <span className="text-xs font-bold text-muted-foreground">Primaire</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}