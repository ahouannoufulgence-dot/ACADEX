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
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">Agenda Institutionnel</h1>
            <p className="text-slate-500 font-medium">Gestion des événements clés.</p>
          </div>
          <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-11 px-6 shadow-md rounded-xl transition-all active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[#111827] flex items-center gap-2 text-lg font-bold">
                <CalendarIcon className="w-5 h-5 text-[#14532D]" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-0">
              {events.map((e, i) => (
                <div key={i} className="p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#14532D]/20 hover:bg-white transition-all duration-300 group">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-[#111827] group-hover:text-[#14532D] transition-colors">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] font-bold tracking-widest text-[#14532D] border-[#14532D]/20 bg-white uppercase h-6 px-3 group-hover:bg-[#14532D] group-hover:text-white transition-all">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14532D]" /> {e.time}</span>
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14532D]" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card">
             <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold">Notes Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-4">
              <textarea 
                className="w-full h-48 bg-slate-50 rounded-xl border-none p-4 text-sm text-[#111827] placeholder:text-slate-400 focus:ring-1 focus:ring-[#14532D]/20 outline-none transition-all shadow-inner"
                placeholder="Pense-bête personnel..."
              />
              <Button className="w-full bg-[#14532D] hover:bg-[#166534] text-white font-bold h-12 rounded-xl transition-all active:scale-95">
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}