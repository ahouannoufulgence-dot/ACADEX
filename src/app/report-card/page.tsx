
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookOpen, Download, Printer, ShieldCheck, Star, Clock, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReportCardPage() {
  const trimesters = [
    { id: 1, name: "Trimestre 1", status: "Session Ouverte", avg: "--", rank: "--", date: "En cours", color: "border-accent bg-accent/5" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-black text-[#0F172A] mb-2 tracking-tight">Bulletins Officiels</h1>
            <p className="text-[#0F172A] text-lg font-black opacity-60">Consultez et téléchargez vos rapports certifiés.</p>
          </div>
          <Badge className="bg-[#14532D] text-white font-black h-10 px-6 rounded-xl flex gap-2 shadow-lg border-2 border-white/10 uppercase tracking-widest text-[10px]">
            <ShieldCheck className="w-5 h-5" /> Documents Certifiés
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Focused Bulletin - Reset for T1 2026-2027 */}
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                <Star size={200} className="text-[#14532D]" />
             </div>
             <CardHeader className="p-10 md:p-12">
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <Badge className="bg-accent text-white mb-4 px-4 py-1 font-black text-[10px] tracking-widest uppercase border-none shadow-md">Session Actuelle</Badge>
                      <CardTitle className="text-4xl md:text-6xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase">{trimesters[0].name}</CardTitle>
                      <CardDescription className="text-xl font-black text-primary uppercase tracking-widest opacity-60">Session Académique 2026-2027</CardDescription>
                   </div>
                   <div className="p-4 rounded-2xl bg-[#14532D] text-white shadow-2xl rotate-3 border-4 border-white/10">
                      <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-10 md:p-12 pt-0 relative z-10">
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="p-8 rounded-[2rem] bg-white border-2 border-slate-50 shadow-inner space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Moyenne Générale</p>
                      <p className="text-5xl font-headline font-black text-slate-300 tracking-tighter">{trimesters[0].avg}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white border-2 border-slate-50 shadow-inner space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position de Classe</p>
                      <p className="text-5xl font-headline font-black text-slate-300 tracking-tighter">{trimesters[0].rank}</p>
                   </div>
                </div>
                
                <div className="p-8 rounded-3xl bg-slate-50 text-[#0F172A] border-4 border-dashed border-slate-100 text-center italic font-black text-sm md:text-lg">
                   Le bulletin sera disponible dès la clôture de la saisie des notes par les enseignants.
                </div>
             </CardContent>
          </Card>

          {/* Sidebar - Archive / History (Starting point for 2026-2027) */}
          <div className="space-y-6">
             <h3 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.4em] flex items-center gap-2 ml-2">
                <Clock className="w-4 h-4 text-primary" /> Archives Scolaires
             </h3>
             <div className="p-10 rounded-[2.5rem] bg-white border-4 border-slate-50 text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-slate-100">
                   <FileText className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                   Aucune archive pour la session 2026-2027.
                </p>
             </div>
             
             <div className="p-8 rounded-[2.5rem] bg-primary text-white flex gap-5 items-start shadow-2xl border-4 border-white/10 relative overflow-hidden group">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                   <ShieldCheck size={80} />
                </div>
                <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
                <p className="text-[10px] md:text-xs text-white leading-relaxed font-black uppercase tracking-widest opacity-90 relative z-10">
                   <strong>Authenticité :</strong> Tous les bulletins téléchargés sur ACADEX portent une signature numérique certifiée 2026 garantissant leur validité officielle.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
