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
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-2">Agenda Personnel</h1>
            <p className="text-muted-foreground">Vos événements et rappels importants.</p>
          </div>
          <Button className="bg-[#1A6B4A] hover:bg-[#1A6B4A]/90 text-white font-bold shadow-lg shadow-[#1A6B4A]/20">
            <Plus className="w-4 h-4 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="premium-card h-fit">
            <CardHeader>
              <CardTitle className="text-[#1F2937] flex items-center gap-2 text-lg">
                <CalendarIcon className="w-5 h-5 text-[#1A6B4A]" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((e, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F5F7F9] border border-transparent hover:border-[#1A6B4A]/10 hover:bg-white transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-[#1F2937]">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] text-[#1A6B4A] border-[#1A6B4A]/20 bg-[#1A6B4A]/5">
                      {e.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card bg-[#1A6B4A]/5 border-none">
             <CardHeader>
              <CardTitle className="text-[#1F2937] text-lg">Note Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full h-40 bg-white rounded-xl border border-slate-100 p-4 text-sm text-[#1F2937] focus:ring-1 focus:ring-[#1A6B4A] outline-none shadow-inner"
                placeholder="Écrivez vos notes ici..."
              />
              <Button className="mt-4 w-full bg-[#1A6B4A] hover:bg-[#1A6B4A]/90 text-white font-bold h-11">
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
