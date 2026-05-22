
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Clock, Plus, Tag, StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AgendaPage() {
  const events = [
    { title: "Devoir de Maths", type: "Évaluation", class: "3ème A", time: "Demain, 08:00" },
    { title: "Conseil de Classe", type: "Réunion", class: "Tous", time: "Vendredi, 15:00" },
    { title: "Saisie des notes T2", type: "Deadline", class: "Tous", time: "20 Mars" },
    { title: "Fête de fin de trimestre", type: "Événement", class: "Tous", time: "28 Mars" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Adaptive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Agenda</h1>
            <p className="text-[#0F172A] text-sm md:text-2xl font-black opacity-80 uppercase tracking-[0.3em]">Événements Élite</p>
          </div>
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-18 px-6 md:px-12 shadow-xl rounded-2xl md:rounded-[2rem] transition-all active:scale-95 border-4 border-white/10 w-full md:w-auto text-xs md:text-xl uppercase tracking-tighter shrink-0">
            <Plus className="w-4 h-4 md:w-8 md:h-8 mr-2 md:mr-4" /> Nouvel Événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {/* Events List - Compact Quadrants on mobile */}
          <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white/95 p-4 md:p-10 rounded-[2rem] md:rounded-[3rem]">
            <CardHeader className="p-0 pb-6 md:pb-10 border-b-4 border-slate-50 flex flex-row items-center gap-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0 rotate-3 border-2 border-primary/5 shadow-inner">
                <CalendarIcon className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <CardTitle className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Calendrier</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-6 md:pt-10">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-6">
                {events.map((e, i) => (
                  <div key={i} className="p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border-4 border-white shadow-xl hover:border-primary/20 hover:bg-white transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3 md:mb-4">
                      <p className="text-[10px] md:text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors tracking-tighter uppercase leading-tight">{e.title}</p>
                      <Badge className="bg-primary text-white text-[7px] md:text-[10px] font-black tracking-widest uppercase h-5 md:h-8 px-2 md:px-4 border-none shadow-lg w-fit">
                        {e.type}
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 text-[7px] md:text-[12px] text-[#0F172A] font-black uppercase tracking-widest opacity-60">
                      <span className="flex items-center gap-1.5 md:gap-3"><Clock className="w-3 h-3 md:w-5 md:h-5 text-primary" /> {e.time}</span>
                      <span className="flex items-center gap-1.5 md:gap-3"><Tag className="w-3 h-3 md:w-5 md:h-5 text-primary" /> {e.class}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Notes - Compact Quadrant */}
          <Card className="vivid-box border-none shadow-2xl bg-white/95 p-4 md:p-10 rounded-[2rem] md:rounded-[3.5rem] h-fit">
             <CardHeader className="p-0 pb-6 md:pb-10 border-b-4 border-slate-50 flex flex-row items-center gap-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0 -rotate-3 border-2 border-primary/5 shadow-inner">
                <StickyNote className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <CardTitle className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-6 md:pt-10 space-y-6 md:space-y-10">
              <div className="space-y-3">
                <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Pense-bête</label>
                <textarea 
                  className="w-full h-32 md:h-64 bg-slate-50 rounded-[1.25rem] md:rounded-[2rem] border-4 border-white p-4 md:p-10 text-[10px] md:text-xl font-black text-[#0F172A] placeholder:text-slate-300 focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-inner resize-none"
                  placeholder="Note stratégique..."
                />
              </div>
              <Button className="w-full bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-20 rounded-[1.25rem] md:rounded-[2rem] transition-all active:scale-95 shadow-2xl border-4 border-white/10 uppercase tracking-tighter text-[9px] md:text-xl">
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
