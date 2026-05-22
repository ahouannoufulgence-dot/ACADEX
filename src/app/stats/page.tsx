
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
  // Empty data for fresh start
  const evolutionData = [
    { month: "T1", avg: 0, success: 0 },
  ];

  const cycleData = [
    { name: "Lycée", value: 0, color: "#14532D" },
    { name: "Collège", value: 0, color: "#111827" },
    { name: "Primaire", value: 0, color: "#B91C1C" },
  ];

  const gradeDistributionData = [
    { name: "En attente", value: 1, color: "#E2E8F0" },
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
          <div className="px-6 py-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-bold text-[#14532D] shadow-xl">
            <Activity className="w-5 h-5 text-slate-300" /> Initialisation...
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
           <StatMiniCard label="Moyenne Générale" value="0.00" trend="--" status="neutral" delay="0s" />
           <StatMiniCard label="Taux Admission" value="0%" trend="--" status="neutral" delay="0.1s" />
           <StatMiniCard label="Abandon" value="0%" trend="--" status="neutral" delay="0.2s" />
        </div>

        <Card className="premium-card p-20 flex flex-col items-center justify-center text-center space-y-6">
            <BarChart3 className="w-20 h-20 text-slate-100" />
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-slate-400">En attente de données</h3>
              <p className="text-slate-400 font-medium mt-2">
                Les graphiques et analyses se généreront automatiquement au fur et à mesure de l'inscription des élèves et de la saisie des notes.
              </p>
            </div>
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
            status === 'up' ? "bg-green-100 text-[#14532D]" : 
            status === 'down' ? "bg-red-100 text-[#B91C1C]" : "bg-slate-100 text-slate-400"
          )} variant="outline">
             {trend}
          </Badge>
       </div>
    </Card>
  );
}
