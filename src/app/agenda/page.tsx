
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
      <div className="space-y-6 md:space-y-10 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Adaptive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left w-full">
            <h1 className="text-2xl md:text-5xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Agenda</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-[0.3em]">Événements Élite</p>
          </div>
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-11 md:h-14 px-6 md:px-8 shadow-xl rounded-xl md:rounded-2xl transition-all active:scale-95 border-2 border-white/10 w-full md:w-auto text-[10px] md:text-base uppercase tracking-tighter shrink-0">
            <Plus className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2" /> Nouvel Événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Events List */}
          <Card className="lg:col-span-2 vivid-box border-none shadow-xl bg-white/95 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem]">
            <CardHeader className="p-0 pb-4 md:pb-6 border-b-2 border-slate-50 flex flex-row items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary shrink-0 rotate-3 border border-primary/5 shadow-inner">
                <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <CardTitle className="text-lg md:text-2xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Calendrier</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 md:pt-6">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                {events.map((e, i) => (
                  <div key={i} className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-white shadow-md hover:border-primary/20 hover:bg-white transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1.5 mb-2 md:mb-3">
                      <p className="text-[9px] md:text-lg font-black text-[#0F172A] group-hover:text-primary transition-colors tracking-tighter uppercase leading-tight">{e.title}</p>
                      <Badge className="bg-primary text-white text-[6px] md:text-[8px] font-black tracking-widest uppercase h-4 md:h-6 px-1.5 md:px-3 border-none shadow-md w-fit">
                        {e.type}
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-[6px] md:text-[10px] text-[#0F172A] font-black uppercase tracking-widest opacity-60">
                      <span className="flex items-center gap-1.5"><Clock className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary" /> {e.time}</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary" /> {e.class}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <Card className="vivid-box border-none shadow-xl bg-white/95 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] h-fit">
             <CardHeader className="p-0 pb-4 md:pb-6 border-b-2 border-slate-50 flex flex-row items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary shrink-0 -rotate-3 border border-primary/5 shadow-inner">
                <StickyNote className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <CardTitle className="text-lg md:text-2xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 md:pt-6 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Pense-bête</label>
                <textarea 
                  className="w-full h-24 md:h-32 bg-slate-50 rounded-lg md:rounded-xl border-2 border-white p-3 md:p-4 text-[9px] md:text-base font-black text-[#0F172A] placeholder:text-slate-300 outline-none transition-all shadow-inner resize-none"
                  placeholder="Note stratégique..."
                />
              </div>
              <Button className="w-full bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-12 rounded-lg md:rounded-xl transition-all active:scale-95 shadow-xl border-2 border-white/10 uppercase tracking-tighter text-[8px] md:text-sm">
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
