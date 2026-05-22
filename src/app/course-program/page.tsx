"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookOpen, CheckCircle2, Circle, Clock, Plus, Sparkles, BookMarked, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CourseProgramPage() {
  const [chapters, setChapters] = useState([
    { id: 1, title: "Introduction aux Matrices", status: "Terminé", progress: 100, class: "TLE D" },
    { id: 2, title: "Probabilités Conditionnelles", status: "En cours", progress: 65, class: "TLE D" },
    { id: 3, title: "Suites Numériques", status: "À venir", progress: 0, class: "3EME A" },
    { id: 4, title: "Géométrie dans l'espace", status: "À venir", progress: 0, class: "3EME A" },
  ]);

  const toggleStatus = (id: number) => {
    // Spontané : Mise à jour instantanée de l'état local
    setChapters(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextStatus = ch.status === "Terminé" ? "À venir" : ch.status === "En cours" ? "Terminé" : "En cours";
        const nextProgress = nextStatus === "Terminé" ? 100 : nextStatus === "En cours" ? 50 : 0;
        return { ...ch, status: nextStatus, progress: nextProgress };
      }
      return ch;
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Vivid Elite */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left w-full">
            <h1 className="text-2xl md:text-5xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Programme Pédagogique</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-[0.3em]">Suivi des Chapitres • 2026-2027</p>
          </div>
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-11 md:h-14 px-6 md:px-8 shadow-xl rounded-xl md:rounded-2xl transition-all active:scale-95 border-2 border-white/10 w-full md:w-auto text-[10px] md:text-base uppercase tracking-tighter shrink-0">
            <Plus className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2" /> Nouveau Chapitre
          </Button>
        </div>

        {/* Global Progress Quadrant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-2">
          <Card className="md:col-span-2 vivid-box border-none bg-primary text-white p-6 md:p-10 shadow-2xl relative overflow-hidden group rounded-[2rem]">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg shadow-lg rotate-3">
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                   </div>
                   <p className="text-[10px] md:text-xl font-black uppercase tracking-[0.3em] text-accent">Avancement Global</p>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <h4 className="text-2xl md:text-6xl font-black tracking-tighter leading-none">42% achevé</h4>
                      <span className="text-[8px] md:text-sm font-black uppercase opacity-60">Trimestre 1</span>
                   </div>
                   <Progress value={42} className="h-3 md:h-4 bg-white/10" />
                </div>
             </div>
             <BookOpen className="absolute right-[-20px] bottom-[-20px] w-24 h-24 md:w-56 md:h-56 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
          </Card>

          <Card className="vivid-box p-6 md:p-10 flex flex-col justify-between shadow-2xl bg-white/95 rounded-[2rem] border-2 border-slate-50">
             <div className="flex justify-between items-start">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner border-2 border-slate-100 rotate-6">
                   <BookMarked className="w-5 h-5 md:w-8 md:h-8 text-primary" />
                </div>
                <Badge className="bg-primary text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1">Élite</Badge>
             </div>
             <div className="mt-4">
                <p className="text-[8px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest">Chapitres restants</p>
                <p className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">12</p>
             </div>
          </Card>
        </div>

        {/* Chapters Micro-Quadrants */}
        <div className="px-2 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-[10px] md:text-xl font-black text-[#0F172A] uppercase tracking-[0.4em]">Registre des Cours</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {chapters.map((ch) => (
              <Card 
                key={ch.id} 
                className="vivid-box border-none shadow-xl bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] group hover:scale-[1.05] transition-all cursor-pointer border-b-4 border-slate-100 active:border-primary"
                onClick={() => toggleStatus(ch.id)}
              >
                <div className="flex justify-between items-start mb-4 md:mb-8">
                   <div className={cn(
                     "w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6",
                     ch.status === "Terminé" ? "bg-accent text-white" : ch.status === "En cours" ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                   )}>
                     {ch.status === "Terminé" ? <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" /> : <Clock className="w-4 h-4 md:w-6 md:h-6" />}
                   </div>
                   <Badge variant="outline" className="border-2 border-slate-100 font-black text-[6px] md:text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-lg text-[#0F172A]">
                     {ch.class}
                   </Badge>
                </div>
                
                <div className="space-y-1 md:space-y-3 mb-4 md:mb-8">
                   <p className="text-[9px] md:text-lg font-black text-[#0F172A] uppercase leading-tight tracking-tighter group-hover:text-primary transition-colors">
                     {ch.title}
                   </p>
                   <p className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {ch.status}
                   </p>
                </div>

                <div className="pt-2 md:pt-4 border-t-2 border-slate-50 flex items-center justify-between">
                   <div className="flex-1 mr-4">
                      <Progress value={ch.progress} className="h-1 md:h-2" />
                   </div>
                   <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
