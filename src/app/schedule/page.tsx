"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  MapPin,
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const hours = ["08h00", "09h00", "10h00", "11h00", "12h00", "14h00", "15h00", "16h00", "17h00"];
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const scheduleData = [
    { day: "Lundi", hour: "08h00", subject: "Mathématiques", room: "S01", teacher: "M. Kouassi", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { day: "Lundi", hour: "10h00", subject: "Français", room: "S05", teacher: "Mme Soglo", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { day: "Mardi", hour: "09h00", subject: "Physique-Chimie", room: "Labo 1", teacher: "M. Amoussou", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { day: "Mercredi", hour: "08h00", subject: "Anglais", room: "S03", teacher: "Mme Dossou", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { day: "Jeudi", hour: "14h00", subject: "SVT", room: "S12", teacher: "M. Kossou", color: "bg-rose-50 text-rose-700 border-rose-200" },
    { day: "Vendredi", hour: "11h00", subject: "Philosophie", room: "S01", teacher: "M. Akpo", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  ];

  const getCourse = (day: string, hour: string) => {
    return scheduleData.find(c => c.day === day && c.hour === hour);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Emploi du temps</h1>
            <p className="text-slate-500 text-lg font-medium">Planning hebdomadaire des cours et activités académiques.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100">
            <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-slate-50 rounded-xl">
              <ChevronLeft className="w-6 h-6 text-slate-400" />
            </Button>
            <div className="px-8 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Semaine Actuelle</span>
              <span className="text-base font-bold text-[#111827]">11 — 16 Mars 2024</span>
            </div>
            <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-slate-50 rounded-xl">
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </Button>
          </div>
        </div>

        <Card className="premium-card border-none shadow-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto sidebar-scroll">
            <div className="min-w-[1000px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                <div className="p-8 text-center border-r border-slate-100 bg-white flex items-center justify-center">
                   <Clock className="w-6 h-6 text-slate-300" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-8 text-center border-r border-slate-100 last:border-r-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{day.substring(0, 3)}</p>
                    <p className="text-xl font-headline font-bold text-[#111827]">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[140px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r border-slate-100 bg-slate-50/20">
                      <span className="text-sm font-black text-slate-400 font-mono tracking-tighter">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-3 border-r border-slate-100 last:border-r-0 relative group hover:bg-slate-50/30 transition-colors">
                          {course ? (
                            <div className={cn(
                              "h-full w-full rounded-2xl p-5 border shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg flex flex-col justify-between",
                              course.color
                            )}>
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <p className="text-xs font-black uppercase tracking-tight leading-tight">{course.subject}</p>
                                  <div className="p-1.5 rounded-lg bg-white/40">
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>Salle {course.room}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-3 border-t border-current/10">
                                <UserIcon className="w-3.5 h-3.5 opacity-60" />
                                <span className="text-[10px] font-bold truncate uppercase tracking-widest">{course.teacher}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center group-hover:border-slate-200 transition-colors">
                               <span className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Libre</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Legend / Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="premium-card border-none bg-[#14532D] text-white p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Prochain Cours</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">Mathématiques</h4>
                <p className="text-base text-emerald-100/80 font-medium">08h00 • Salle S01 avec M. Kouassi</p>
              </div>
            </div>
            <Clock className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700" />
          </Card>
          
          <Card className="premium-card p-8 flex items-center gap-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Volume Hebdomadaire</p>
              <p className="text-3xl font-headline font-bold text-[#111827]">28 Heures</p>
            </div>
          </Card>

          <Card className="premium-card p-8 flex items-center gap-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shadow-inner">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Localisation</p>
              <p className="text-3xl font-headline font-bold text-[#111827]">Bloc Principal</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}