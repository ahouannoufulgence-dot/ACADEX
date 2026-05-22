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
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Agenda Institutionnel</h1>
            <p className="text-slate-500 text-lg font-medium">Gestion des événements clés de l'établissement.</p>
          </div>
          <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 px-8 shadow-xl rounded-[1.25rem] transition-all active:scale-95">
            <Plus className="w-5 h-5 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-3 text-xl font-bold">
                <CalendarIcon className="w-6 h-6 text-[#16A34A]" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-10 pt-0">
              {events.map((e, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-[#16A34A]/30 hover:bg-white transition-all duration-300 group shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-bold text-[#111827] group-hover:text-[#14532D] transition-colors">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] font-bold tracking-[0.1em] text-[#14532D] border-[#16A34A]/20 bg-white uppercase h-7 px-4 group-hover:bg-[#16A34A] group-hover:text-white transition-all">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> {e.time}</span>
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-accent" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card">
             <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xl font-bold">Notes Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-10 pt-4">
              <textarea 
                className="w-full h-64 bg-slate-50 rounded-[1.25rem] border-slate-200 p-6 text-sm text-[#111827] placeholder:text-slate-400 focus:ring-2 focus:ring-[#16A34A]/20 outline-none transition-all shadow-inner"
                placeholder="Pense-bête personnel pour le prochain conseil..."
              />
              <Button className="w-full bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 rounded-[1.25rem] transition-all active:scale-95 shadow-lg">
                Sauvegarder la note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}