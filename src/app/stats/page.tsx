
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
      <div className="space-y-12 animate-fade-up">
        {/* Header Section - Vivid Elite */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Analyses <span className="text-primary">Décisionnelles</span></h1>
            <p className="text-slate-500 text-xl md:text-2xl font-bold">Performance globale de l'institution en temps réel.</p>
          </div>
          <div className="px-8 py-5 rounded-[2rem] bg-white border-2 border-primary/10 flex items-center gap-5 text-sm font-black text-primary shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent animate-pulse" />
            </div>
            Initialisation du Trimestre 1...
          </div>
        </div>

        {/* Mini Stats - Vivid Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
           <StatMiniCard label="Moyenne Générale" value="0.00" trend="--" status="neutral" delay="0s" />
           <StatMiniCard label="Taux Admission" value="0%" trend="--" status="neutral" delay="0.1s" />
           <StatMiniCard label="Dossiers IA Générés" value="0" trend="Nouveau" status="positive" delay="0.2s" />
        </div>

        {/* Empty State - Vivid & Clear */}
        <Card className="vivid-box p-32 flex flex-col items-center justify-center text-center space-y-10 bg-white border-none shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
            <div className="p-12 rounded-[4rem] bg-slate-50 border-4 border-slate-100 shadow-inner rotate-3">
              <BarChart3 className="w-28 h-28 text-slate-200" />
            </div>
            <div className="max-w-md">
              <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">En attente de données</h3>
              <p className="text-slate-400 font-bold mt-6 text-xl leading-relaxed">
                Les graphiques et analyses se généreront automatiquement dès que les premières notes du trimestre seront publiées.
              </p>
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ label, value, trend, status, delay }: any) {
  return (
    <Card className="vivid-box p-12 animate-fade-up bg-white border-none shadow-2xl transition-all hover:scale-[1.02]" style={{ animationDelay: delay }}>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-6xl md:text-8xl font-headline font-black text-[#0F172A] tracking-tighter">{value}</p>
          <Badge className={cn(
            "text-xs font-black px-6 py-2.5 border-none shadow-lg rounded-xl h-10 flex items-center gap-2",
            status === 'positive' ? "bg-accent text-white" : 
            status === 'negative' ? "bg-[#B91C1C] text-white" : "bg-slate-100 text-slate-400"
          )} variant="outline">
             {status === 'positive' && <TrendingUp className="w-4 h-4" />}
             {trend}
          </Badge>
       </div>
    </Card>
  );
}
