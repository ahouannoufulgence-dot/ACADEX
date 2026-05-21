"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Emploi du temps</h1>
            <p className="text-muted-foreground">Visualisation hebdomadaire des cours.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-xs font-bold px-4">Semaine du 11 au 16 Mars</span>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        <Card className="glass-card border-none overflow-hidden shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-white/5">
            <div className="grid grid-cols-7 gap-4">
              <div className="text-xs font-bold text-muted-foreground uppercase text-center flex items-center justify-center">Heure</div>
              {days.map(day => (
                <div key={day} className="text-xs font-bold text-white uppercase text-center">{day}</div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-7 gap-4 min-h-[80px]">
                  <div className="text-[10px] font-bold text-muted-foreground flex items-center justify-center border-r border-white/5">{hour}</div>
                  {days.map(day => (
                    <div key={day} className="p-2 relative">
                      {/* Simuler quelques cours */}
                      {hour === "08:00" && day === "Lundi" && (
                        <div className="absolute inset-1 rounded-lg bg-primary/20 border-l-4 border-primary p-2">
                          <p className="text-[10px] font-bold text-white">MATHS</p>
                          <p className="text-[8px] text-accent">6ème D • S01</p>
                        </div>
                      )}
                      {hour === "10:00" && day === "Mardi" && (
                        <div className="absolute inset-1 rounded-lg bg-blue-500/20 border-l-4 border-blue-500 p-2">
                          <p className="text-[10px] font-bold text-white">FRANCAIS</p>
                          <p className="text-[8px] text-blue-400">3ème A • S05</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}