"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Clock, Plus, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AgendaPage() {
  const events = [
    { title: "Devoir de Maths", type: "Évaluation", class: "3ème A", time: "Demain, 08:00" },
    { title: "Conseil de Classe", type: "Réunion", class: "Tous", time: "Vendredi, 15:00" },
    { title: "Saisie des notes T2", type: "Deadline", class: "Tous", time: "20 Mars" },
    { title: "Fête de fin de trimestre", type: "Événement", class: "Tous", time: "28 Mars" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">Agenda Institutionnel</h1>
            <p className="text-slate-500 font-medium">Gestion des événements et dates clés de l'établissement.</p>
          </div>
          <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-13 px-8 shadow-xl rounded-xl transition-all">
            <Plus className="w-5 h-5 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <CalendarIcon className="w-6 h-6 text-[#14532D]" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {events.map((e, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#14532D]/20 hover:bg-white transition-all duration-300 group cursor-default">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base font-bold text-[#111827] group-hover:text-[#14532D] transition-colors">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] font-bold tracking-widest text-[#14532D] border-[#14532D]/20 bg-white uppercase h-7 px-4">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-8 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {e.time}</span>
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card bg-[#111827] border-none shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
             <CardHeader className="relative z-10 pt-10">
              <CardTitle className="text-white text-xl font-bold">Note Administrative</CardTitle>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">Pense-bête personnel</p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10 mt-4">
              <textarea 
                className="w-full h-64 bg-white/5 rounded-2xl border border-white/10 p-6 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all shadow-inner"
                placeholder="Saisissez vos notes ici..."
              />
              <Button className="w-full bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 rounded-xl shadow-lg border-none">
                Sauvegarder la note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
