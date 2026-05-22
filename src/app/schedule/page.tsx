
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
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Compact for Mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Planning</h1>
            <p className="text-[#0F172A] text-sm md:text-2xl font-black opacity-80 uppercase tracking-widest">Hebdomadaire Élite</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl border border-slate-100 w-full md:w-auto justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-11 md:w-11 hover:bg-slate-50 rounded-lg">
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
            </Button>
            <div className="px-2 md:px-8 flex flex-col items-center text-center">
              <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Semaine</span>
              <span className="text-[8px] md:text-base font-black text-[#0F172A]">11 — 16 Mar</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-11 md:w-11 hover:bg-slate-50 rounded-lg">
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Schedule Grid - Ultra Compact for Mobile One-Glance */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white/95 p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-900 border-b border-white/10">
                <div className="p-2 md:p-8 text-center border-r border-white/5 flex items-center justify-center">
                   <Clock className="w-3 h-3 md:w-6 md:h-6 text-white/40" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-2 md:p-8 text-center border-r border-white/5 last:border-r-0">
                    <p className="text-[8px] md:text-2xl font-headline font-black text-white uppercase">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[50px] md:min-h-[160px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r border-slate-100 bg-slate-50/50">
                      <span className="text-[7px] md:text-sm font-black text-[#0F172A] font-mono tracking-tighter">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-0.5 md:p-3 border-r border-slate-100 last:border-r-0 relative">
                          {course ? (
                            <div className={cn(
                              "h-full w-full rounded-md md:rounded-2xl p-1 md:p-5 border shadow-sm flex flex-col justify-between overflow-hidden",
                              course.color
                            )}>
                              <p className="text-[6px] md:text-sm font-black uppercase tracking-tighter leading-none truncate">{course.subject}</p>
                              <div className="hidden md:flex items-center gap-1 text-[10px] font-black opacity-80 pt-2 border-t border-current/10">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">S{course.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-md md:rounded-2xl border border-dashed border-slate-50 flex items-center justify-center opacity-10" />
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

        {/* Quick Info - Quadrants */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
          <Card className="vivid-box border-none bg-primary text-white p-3 md:p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-1 md:space-y-4">
              <p className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent">Prochain</p>
              <h4 className="text-xs md:text-3xl font-black tracking-tighter leading-none">Maths</h4>
              <p className="text-[7px] md:text-base text-emerald-100/80 font-black">08:00 • S01</p>
            </div>
            <Clock className="absolute right-[-5px] bottom-[-5px] w-12 h-12 md:w-32 md:h-32 text-white/10" />
          </Card>
          
          <Card className="vivid-box p-3 md:p-8 flex items-center gap-2 md:gap-8 shadow-xl bg-white">
            <div className="w-6 h-6 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner shrink-0">
              <CalendarIcon className="w-3 h-3 md:w-8 md:h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-[7px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Hebdo</p>
              <p className="text-xs md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter">28H</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
