
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
  User as UserIcon
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
      <div className="space-y-8 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Emploi du temps</h1>
            <p className="text-slate-500 text-lg font-medium">Planning hebdomadaire des cours et activités.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-50 rounded-xl">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </Button>
            <div className="px-6 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semaine Actuelle</span>
              <span className="text-sm font-bold text-[#111827]">11 — 16 Mars 2024</span>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-50 rounded-xl">
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </div>

        <Card className="premium-card border-none shadow-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto sidebar-scroll">
            <div className="min-w-[900px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                <div className="p-6 text-center border-r border-slate-100 bg-white">
                   <Clock className="w-5 h-5 text-slate-300 mx-auto" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-6 text-center border-r border-slate-100 last:border-r-0">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{day.substring(0, 3)}</p>
                    <p className="text-lg font-headline font-bold text-[#111827]">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[120px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r border-slate-100 bg-slate-50/20">
                      <span className="text-sm font-black text-slate-400 font-mono">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-2 border-r border-slate-100 last:border-r-0 relative group hover:bg-slate-50/30 transition-colors">
                          {course ? (
                            <div className={cn(
                              "h-full w-full rounded-2xl p-4 border shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md flex flex-col justify-between",
                              course.color
                            )}>
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-xs font-black uppercase tracking-tight leading-none">{course.subject}</p>
                                  <BookOpen className="w-3.5 h-3.5 opacity-40" />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70 mb-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{course.room}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 pt-2 border-t border-current/10">
                                <UserIcon className="w-3 h-3 opacity-60" />
                                <span className="text-[10px] font-bold truncate">{course.teacher}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-2xl border-2 border-dashed border-slate-50 flex items-center justify-center group-hover:border-slate-100 transition-colors">
                               <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Libre</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="premium-card border-none bg-emerald-600 text-white p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-2">Statut Prochain Cours</p>
              <h4 className="text-xl font-bold">Mathématiques • 08h00</h4>
              <p className="text-sm text-emerald-50/80 mt-1">Salle S01 avec M. Kouassi</p>
            </div>
            <Clock className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-700" />
          </Card>
          
          <Card className="premium-card border-none bg-white p-6 shadow-xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Charge Hebdomadaire</p>
              <p className="text-2xl font-headline font-bold text-[#111827]">28 Heures</p>
            </div>
          </Card>

          <Card className="premium-card border-none bg-white p-6 shadow-xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#14532D]/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#14532D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bâtiment Principal</p>
              <p className="text-2xl font-headline font-bold text-[#111827]">Bloc A & B</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
