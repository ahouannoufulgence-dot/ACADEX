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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Analyses <span className="text-primary">Décisionnelles</span></h1>
            <p className="text-slate-500 text-xl md:text-2xl font-bold">Performance globale de l'institution en temps réel.</p>
          </div>
          <div className="px-8 py-4 rounded-3xl bg-white border-2 border-slate-100 flex items-center gap-4 text-sm font-black text-primary shadow-2xl">
            <Activity className="w-6 h-6 text-accent animate-pulse" /> Initialisation du Trimestre 1...
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
           <StatMiniCard label="Moyenne Générale" value="0.00" trend="--" status="neutral" delay="0s" />
           <StatMiniCard label="Taux Admission" value="0%" trend="--" status="neutral" delay="0.1s" />
           <StatMiniCard label="Abandon" value="0%" trend="--" status="neutral" delay="0.2s" />
        </div>

        <Card className="vivid-box p-32 flex flex-col items-center justify-center text-center space-y-8 bg-white border-none">
            <div className="p-10 rounded-[3rem] bg-slate-50 border-4 border-slate-100 shadow-inner">
              <BarChart3 className="w-24 h-24 text-slate-200" />
            </div>
            <div className="max-w-md">
              <h3 className="text-3xl font-black text-slate-400 tracking-tight">En attente de données</h3>
              <p className="text-slate-400 font-bold mt-4 text-lg">
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
    <Card className="vivid-box p-12 animate-fade-up bg-white border-none" style={{ animationDelay: delay }}>
       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-5xl md:text-7xl font-headline font-black text-[#0F172A] tracking-tighter">{value}</p>
          <Badge className={cn(
            "text-xs font-black px-6 py-2 border-none shadow-xl",
            status === 'up' ? "bg-green-100 text-[#14532D]" : 
            status === 'down' ? "bg-red-100 text-[#B91C1C]" : "bg-slate-100 text-slate-400"
          )} variant="outline">
             {trend}
          </Badge>
       </div>
    </Card>
  );
}