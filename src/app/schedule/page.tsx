"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const hours = ["08h00", "09h00", "10h00", "11h00", "12h00", "14h00", "15h00", "16h00", "17h00"];
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const scheduleData = [
    { day: "Lun", hour: "08h00", subject: "Maths", room: "S01", teacher: "Kouassi", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { day: "Lun", hour: "10h00", subject: "Français", room: "S05", teacher: "Soglo", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { day: "Mar", hour: "09h00", subject: "Physique", room: "L1", teacher: "Amoussou", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { day: "Mer", hour: "08h00", subject: "Anglais", room: "S03", teacher: "Dossou", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { day: "Jeu", hour: "14h00", subject: "SVT", room: "S12", teacher: "Kossou", color: "bg-rose-50 text-rose-700 border-rose-200" },
    { day: "Ven", hour: "11h00", subject: "Philo", room: "S01", teacher: "Akpo", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  ];

  const getCourse = (day: string, hour: string) => {
    return scheduleData.find(c => c.day === day && c.hour === hour);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-16 animate-fade-up max-w-full overflow-hidden">
        {/* Header - High Contrast */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="w-full text-left">
            <h1 className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Planning</h1>
            <p className="text-[#0F172A] text-sm md:text-3xl font-black opacity-80 uppercase tracking-[0.4em]">Hebdomadaire Élite</p>
          </div>
          <div className="flex items-center gap-4 bg-white/90 p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-4 border-white w-full md:w-auto justify-between backdrop-blur-xl">
            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-18 md:w-18 hover:bg-slate-50 rounded-xl md:rounded-2xl">
              <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 text-slate-400" />
            </Button>
            <div className="px-4 md:px-12 flex flex-col items-center text-center">
              <span className="text-[9px] md:text-[14px] font-black text-slate-400 uppercase tracking-[0.3em]">Semaine Élite</span>
              <span className="text-[12px] md:text-3xl font-black text-[#0F172A] tracking-tighter">11 — 16 Mars</span>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-18 md:w-18 hover:bg-slate-50 rounded-xl md:rounded-2xl">
              <ChevronRight className="w-6 h-6 md:w-10 md:h-10 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Schedule Grid - Small Quadrants for Mobile */}
        <Card className="vivid-box border-none shadow-[0_40px_120px_rgba(0,0,0,0.25)] overflow-hidden bg-white/95 p-0 rounded-[2.5rem] md:rounded-[4rem]">
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-full">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-900 border-b-4 border-white/5">
                <div className="p-3 md:p-12 text-center border-r-2 border-white/5 flex items-center justify-center">
                   <Clock className="w-4 h-4 md:w-12 md:h-12 text-white/30" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-3 md:p-12 text-center border-r-2 border-white/5 last:border-r-0">
                    <p className="text-[10px] md:text-4xl font-headline font-black text-white uppercase tracking-tighter">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y-2 divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[60px] md:min-h-[220px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r-2 border-slate-100 bg-slate-50/50">
                      <span className="text-[9px] md:text-2xl font-black text-[#0F172A] font-mono tracking-tighter opacity-50">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-1 md:p-5 border-r-2 border-slate-100 last:border-r-0 relative group">
                          {course ? (
                            <div className={cn(
                              "h-full w-full rounded-xl md:rounded-[2.5rem] p-2 md:p-10 border-4 shadow-xl flex flex-col justify-between overflow-hidden transition-all group-hover:scale-[1.05] group-hover:rotate-1",
                              course.color
                            )}>
                              <p className="text-[8px] md:text-3xl font-black uppercase tracking-tighter leading-none truncate">{course.subject}</p>
                              <div className="hidden md:flex items-center gap-3 text-xl font-black opacity-80 pt-6 border-t-2 border-current/10 mt-4">
                                <MapPin className="w-6 h-6 shrink-0" />
                                <span className="truncate">SALLE {course.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-xl md:rounded-[2.5rem] border-4 border-dashed border-slate-50/50 flex items-center justify-center opacity-5" />
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

        {/* Quick Stats Quadrants */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
          <Card className="vivid-box border-none bg-primary text-white p-6 md:p-14 shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <div className="relative z-10 space-y-2 md:space-y-6">
              <p className="text-[10px] md:text-xl font-black uppercase tracking-[0.3em] text-accent">Prochain Cours</p>
              <h4 className="text-xl md:text-6xl font-black tracking-tighter leading-none">Mathématiques</h4>
              <p className="text-[10px] md:text-2xl text-emerald-100 font-black opacity-80">08:00 • Salle S01</p>
            </div>
            <Clock className="absolute right-[-10px] bottom-[-10px] w-16 h-16 md:w-56 md:h-56 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
          </Card>
          
          <Card className="vivid-box p-6 md:p-14 flex items-center gap-4 md:gap-12 shadow-2xl bg-white/95 rounded-[2.5rem]">
            <div className="w-10 h-10 md:w-28 md:h-28 rounded-2xl md:rounded-[2rem] bg-slate-50 flex items-center justify-center shadow-inner shrink-0 rotate-3 border-4 border-slate-100">
              <CalendarIcon className="w-6 h-6 md:w-14 md:h-14 text-primary" />
            </div>
            <div>
              <p className="text-[10px] md:text-xl font-black text-slate-400 uppercase tracking-[0.3em]">Charge Hebdo</p>
              <p className="text-3xl md:text-8xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">28H</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}