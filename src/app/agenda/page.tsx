"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Clock, Plus, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgendaPage() {
  const events = [
    { title: "Devoir de Maths", type: "Évaluation", class: "3ème A", time: "Demain, 08:00" },
    { title: "Conseil de Classe", type: "Réunion", class: "Tous", time: "Vendredi, 15:00" },
    { title: "Saisie des notes T2", type: "Deadline", class: "Tous", time: "20 Mars" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Agenda Personnel</h1>
            <p className="text-muted-foreground">Vos événements et rappels importants.</p>
          </div>
          <Button className="bg-primary text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Nouvel événement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card border-none shadow-xl h-fit">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent" />
                Prochains événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((e, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-white">{e.title}</p>
                    <Badge variant="outline" className="text-[10px] text-accent border-accent/20">{e.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {e.class}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl bg-accent/5">
             <CardHeader>
              <CardTitle className="text-white">Note Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full h-40 bg-white/5 rounded-xl border border-white/10 p-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none"
                placeholder="Écrivez vos notes ici..."
              />
              <Button className="mt-4 w-full bg-accent text-black font-bold">Sauvegarder</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}