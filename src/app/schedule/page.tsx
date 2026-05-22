
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Compact for Mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Emploi du temps</h1>
            <p className="text-[#0F172A] text-sm md:text-2xl font-black opacity-80 uppercase tracking-widest">Planning Élite Hebdomadaire</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl border border-slate-100 w-full md:w-auto justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-11 md:w-11 hover:bg-slate-50 rounded-lg">
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
            </Button>
            <div className="px-4 md:px-8 flex flex-col items-center text-center">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Semaine Actuelle</span>
              <span className="text-[10px] md:text-base font-black text-[#0F172A]">11 — 16 Mars 2024</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-11 md:w-11 hover:bg-slate-50 rounded-lg">
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Schedule Grid - Optimized for "At a glance" */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white/95 p-0">
          <div className="overflow-x-auto sidebar-scroll">
            <div className="min-w-[700px] md:min-w-[1200px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-900 border-b border-white/10">
                <div className="p-3 md:p-8 text-center border-r border-white/5 bg-slate-900 flex items-center justify-center">
                   <Clock className="w-4 h-4 md:w-6 md:h-6 text-white/40" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-3 md:p-8 text-center border-r border-white/5 last:border-r-0">
                    <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{day.substring(0, 3)}</p>
                    <p className="text-xs md:text-2xl font-headline font-black text-white uppercase">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[80px] md:min-h-[160px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r border-slate-100 bg-slate-50/50">
                      <span className="text-[10px] md:text-sm font-black text-[#0F172A] font-mono tracking-tighter">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-1 md:p-3 border-r border-slate-100 last:border-r-0 relative group hover:bg-slate-50/30 transition-colors">
                          {course ? (
                            <div className={cn(
                              "h-full w-full rounded-xl md:rounded-2xl p-2 md:p-5 border shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg flex flex-col justify-between overflow-hidden",
                              course.color
                            )}>
                              <div className="space-y-1 md:space-y-3">
                                <div className="flex justify-between items-start">
                                  <p className="text-[8px] md:text-sm font-black uppercase tracking-tighter leading-tight truncate pr-1">{course.subject}</p>
                                  <div className="hidden md:block p-1.5 rounded-lg bg-white/40">
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-[7px] md:text-[10px] font-black opacity-80">
                                  <MapPin className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
                                  <span className="truncate">S{course.room}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 md:gap-2 pt-1 md:pt-3 border-t border-current/10">
                                <UserIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 opacity-60 shrink-0" />
                                <span className="text-[7px] md:text-[10px] font-black truncate uppercase tracking-widest">{course.teacher.split(' ').pop()}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-xl md:rounded-2xl border-2 border-dashed border-slate-50 flex items-center justify-center opacity-30">
                               <span className="hidden md:block text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">Libre</span>
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

        {/* Quick Info - Small Cadrants for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <Card className="vivid-box border-none bg-primary text-white p-4 md:p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-accent animate-pulse" />
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent">Suivant</p>
              </div>
              <div>
                <h4 className="text-xl md:text-3xl font-black tracking-tighter leading-none">Mathématiques</h4>
                <p className="text-xs md:text-base text-emerald-100/80 font-black mt-1">08h00 • Salle S01</p>
              </div>
            </div>
            <Clock className="absolute right-[-10px] bottom-[-10px] w-20 h-20 md:w-32 md:h-32 text-white/10" />
          </Card>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
            <Card className="vivid-box p-4 md:p-8 flex items-center gap-3 md:gap-8 shadow-xl bg-white">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner shrink-0">
                <CalendarIcon className="w-5 h-5 md:w-8 md:h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-[8px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Hebdo</p>
                <p className="text-xl md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter">28H</p>
              </div>
            </Card>

            <Card className="vivid-box p-4 md:p-8 flex items-center gap-3 md:gap-8 shadow-xl bg-white">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center shadow-inner shrink-0">
                <MapPin className="w-5 h-5 md:w-8 md:h-8 text-accent" />
              </div>
              <div>
                <p className="text-[8px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Lieu</p>
                <p className="text-xl md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter">Bloc A</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
