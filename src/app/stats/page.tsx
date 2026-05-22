"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StatisticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-fade-up">
        {/* Header Section - Vivid Elite */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="max-w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-2 md:mb-4 tracking-tighter">Analyses <span className="text-primary">Décisionnelles</span></h1>
            <p className="text-slate-500 text-sm md:text-2xl font-bold">Performance globale en temps réel.</p>
          </div>
          <div className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white border-2 border-primary/10 flex items-center gap-4 text-[10px] md:text-sm font-black text-primary shadow-xl">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 md:w-6 md:h-6 text-accent animate-pulse" />
            </div>
            Initialisation T1...
          </div>
        </div>

        {/* Mini Stats - Grid adaptative */}
        <div className="stats-grid">
           <StatMiniCard label="Moyenne Générale" value="0.00" trend="--" status="neutral" delay="0s" />
           <StatMiniCard label="Taux Admission" value="0%" trend="--" status="neutral" delay="0.1s" />
           <StatMiniCard label="Dossiers IA Générés" value="0" trend="Nouveau" status="positive" delay="0.2s" />
        </div>

        {/* Empty State - Responsive */}
        <Card className="vivid-box p-12 md:p-32 flex flex-col items-center justify-center text-center space-y-6 md:space-y-10 bg-white border-none shadow-xl">
            <div className="p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] bg-slate-50 border-4 border-slate-100 shadow-inner rotate-3">
              <BarChart3 className="w-16 h-16 md:w-28 md:h-28 text-slate-200" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl md:text-4xl font-black text-[#0F172A] tracking-tighter">En attente de données</h3>
              <p className="text-slate-400 font-bold mt-3 md:mt-6 text-sm md:text-xl leading-relaxed">
                Les graphiques se généreront dès que les notes seront publiées.
              </p>
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ label, value, trend, status, delay }: any) {
  return (
    <Card className="vivid-box p-8 md:p-12 animate-fade-up bg-white border-none shadow-2xl transition-all hover:scale-[1.02]" style={{ animationDelay: delay }}>
       <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 md:mb-8">{label}</p>
       <div className="flex items-end justify-between gap-4">
          <p className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{value}</p>
          <Badge className={cn(
            "text-[9px] md:text-xs font-black px-4 md:px-6 py-2 border-none shadow-lg rounded-xl h-8 md:h-10 flex items-center gap-2 shrink-0",
            status === 'positive' ? "bg-accent text-white" : 
            status === 'negative' ? "bg-[#B91C1C] text-white" : "bg-slate-100 text-slate-400"
          )} variant="outline">
             {status === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
             {trend}
          </Badge>
       </div>
    </Card>
  );
}