"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookOpen, ShieldCheck, Star, Clock, FileText, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReportCardPage() {
  const currentSession = "2026-2027";

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up max-w-[1440px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left">
            <h1 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] mb-2 tracking-tight uppercase leading-none">Rapports Élite</h1>
            <p className="text-primary text-[10px] md:text-2xl font-black opacity-60 uppercase tracking-[0.4em] leading-none">Archives Certifiées</p>
          </div>
          <Badge className="bg-[#14532D] text-white font-black h-12 md:h-16 px-6 md:px-10 rounded-2xl flex gap-3 shadow-2xl border-4 border-white/10 uppercase tracking-[0.2em] text-[9px] md:text-base shrink-0 rotate-2">
            <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-accent" /> Authentification Élite
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Focused Bulletin */}
          <Card className="lg:col-span-2 vivid-box border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.25)] overflow-hidden relative group rounded-[3rem] md:rounded-[4rem] bg-white/95 backdrop-blur-xl">
             <div className="absolute top-0 right-0 p-10 md:p-20 opacity-5 group-hover:scale-110 transition-transform duration-[2000ms]">
                <Star size={200} className="text-[#14532D]" />
             </div>
             <CardHeader className="p-8 md:p-16">
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-4">
                      <Badge className="bg-accent text-white px-5 py-2 font-black text-[9px] md:text-sm tracking-[0.3em] uppercase border-none shadow-xl rounded-xl">SESSION ACTIVE</Badge>
                      <div className="space-y-2">
                        <CardTitle className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] tracking-tighter uppercase leading-none">Trimestre 1</CardTitle>
                        <CardDescription className="text-xs md:text-2xl font-black text-primary uppercase tracking-[0.3em] opacity-60">Cycle Académique {currentSession}</CardDescription>
                      </div>
                   </div>
                   <div className="p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#14532D] text-white shadow-2xl rotate-6 border-4 md:border-8 border-white/10 shrink-0">
                      <BookOpen className="w-8 h-8 md:w-16 md:h-16" />
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-8 md:p-16 pt-0 relative z-10">
                <div className="grid grid-cols-2 gap-4 md:gap-12 mb-10 md:mb-16">
                   <div className="p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] bg-slate-50 border-4 border-white shadow-inner space-y-2 text-center group/card transition-all hover:bg-white">
                      <p className="text-[9px] md:text-[14px] font-black text-slate-400 uppercase tracking-[0.4em]">Moyenne Générale</p>
                      <p className="text-4xl md:text-9xl font-headline font-black text-slate-200 tracking-tighter transition-colors group-hover/card:text-primary leading-none">--</p>
                   </div>
                   <div className="p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] bg-slate-50 border-4 border-white shadow-inner space-y-2 text-center group/card transition-all hover:bg-white">
                      <p className="text-[9px] md:text-[14px] font-black text-slate-400 uppercase tracking-[0.4em]">Rang Élite</p>
                      <p className="text-4xl md:text-9xl font-headline font-black text-slate-200 tracking-tighter transition-colors group-hover/card:text-accent leading-none">--</p>
                   </div>
                </div>
                
                <div className="p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] bg-primary/5 text-[#0F172A] border-4 border-dashed border-primary/20 text-center italic font-black text-sm md:text-2xl leading-tight">
                   "Le relevé certifié sera généré spontanément dès la validation finale de la session {currentSession}."
                </div>
             </CardContent>
          </Card>

          {/* Sidebar - Archive */}
          <div className="space-y-8 md:space-y-12">
             <div className="space-y-4">
                <h3 className="text-[10px] md:text-xl font-black text-[#0F172A] uppercase tracking-[0.6em] flex items-center gap-3 ml-4">
                   <Clock className="w-5 h-5 md:w-8 md:h-8 text-primary" /> Archives
                </h3>
                <div className="p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] bg-white/80 border-4 border-white text-center space-y-6 shadow-2xl backdrop-blur-xl">
                   <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto border-4 border-slate-100 shadow-inner">
                      <FileText className="w-6 h-6 md:w-10 md:h-10 text-slate-200" />
                   </div>
                   <p className="text-[10px] md:text-lg font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed opacity-60">
                      Aucun historique <br/> session {currentSession}
                   </p>
                </div>
             </div>
             
             <div className="p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] bg-primary text-white flex gap-5 md:gap-8 items-start shadow-2xl border-4 md:border-8 border-white/10 relative overflow-hidden group">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                   <ShieldCheck size={120} />
                </div>
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-accent flex items-center justify-center shadow-xl shrink-0 rotate-6 group-hover:rotate-0 transition-transform">
                  <FileCheck className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="space-y-2 relative z-10">
                  <p className="text-[10px] md:text-xl font-black uppercase tracking-[0.3em] text-accent">Sécurité</p>
                  <p className="text-[11px] md:text-lg text-white leading-snug font-black uppercase tracking-widest opacity-90">
                    Certificats numériques inviolables pour la session d'élite {currentSession}.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
