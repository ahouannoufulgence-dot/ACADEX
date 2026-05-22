
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
      <div className="space-y-8 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-2">Agenda Personnel</h1>
            <p className="text-slate-500 font-medium">Vos événements, rappels et dates clés de l'établissement.</p>
          </div>
          <Button className="bg-[#1A6B4A] hover:bg-[#124d35] text-white font-bold h-12 px-6 shadow-xl shadow-[#1A6B4A]/20 rounded-xl transition-all">
            <Plus className="w-5 h-5 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="pb-6">
              <CardTitle className="text-[#1F2937] flex items-center gap-3 text-xl">
                <CalendarIcon className="w-6 h-6 text-[#1A6B4A]" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((e, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#F5F7F9] border border-transparent hover:border-[#1A6B4A]/10 hover:bg-white transition-all duration-300 group cursor-default">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-base font-bold text-[#1F2937] group-hover:text-[#1A6B4A] transition-colors">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] font-bold tracking-widest text-[#1A6B4A] border-[#1A6B4A]/20 bg-[#1A6B4A]/5 uppercase h-6 px-3">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {e.time}</span>
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card bg-[#1A6B4A] border-none shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
             <CardHeader className="relative z-10">
              <CardTitle className="text-white text-xl">Note Rapide</CardTitle>
              <p className="text-white/60 text-xs font-medium">Pense-bête personnel synchronisé.</p>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <textarea 
                className="w-full h-56 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 text-sm text-white placeholder:text-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-all shadow-inner"
                placeholder="Ex: Appeler les parents de Marc pour le dossier..."
              />
              <Button className="w-full bg-white text-[#1A6B4A] hover:bg-white/90 font-bold h-12 rounded-xl shadow-lg">
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
