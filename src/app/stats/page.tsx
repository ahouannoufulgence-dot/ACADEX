"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, GraduationCap } from "lucide-react";
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
    avg: { label: "Moyenne", color: "#84cc16" },
    success: { label: "Taux de réussite", color: "#3b82f6" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Statistiques & Analyses</h1>
          <p className="text-muted-foreground">Analyse visuelle de la performance globale.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Moyenne Générale par mois
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" fill="var(--color-avg)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ChartContainer config={chartConfig} className="hidden" children={null} />
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Répartition des Élèves
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              {/* Simulation de graphique */}
              <div className="flex h-full items-end gap-4 px-4 pb-8">
                <div className="flex-1 bg-primary/20 rounded-t-lg h-[80%] flex items-end justify-center pb-2 text-[10px] font-bold">Lycée</div>
                <div className="flex-1 bg-accent/20 rounded-t-lg h-[60%] flex items-end justify-center pb-2 text-[10px] font-bold">Collège</div>
                <div className="flex-1 bg-blue-500/20 rounded-t-lg h-[40%] flex items-end justify-center pb-2 text-[10px] font-bold">Primaire</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}