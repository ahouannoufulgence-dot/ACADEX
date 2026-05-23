
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { History, BookOpen, GraduationCap, Users, FileText, Search, Filter, ShieldCheck, ArrowRight, Download, Library, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ArchivesPage() {
  const [selectedYear, setSelectedYear] = useState("2025-2026");

  const archivedSessions = [
    { year: "2025-2026", students: 485, avg: "12.45", performance: "+4.2%", status: "Clôturé" },
    { year: "2024-2025", students: 420, avg: "11.80", performance: "+2.1%", status: "Archivé" },
    { year: "2023-2024", students: 395, avg: "11.20", performance: "---", status: "Certifié" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Archives Élite</h1>
            <p className="text-[#0F172A] text-[10px] md:text-2xl font-black opacity-60 uppercase tracking-[0.4em] leading-none mt-2">Consultation Historique</p>
          </div>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl rotate-3 border-4 border-white/20 shrink-0">
             <Library className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
        </div>

        {/* Year Selector & Global Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <Card className="vivid-box border-none shadow-2xl bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] h-fit">
              <CardHeader className="p-0 pb-6 border-b-4 border-slate-50 mb-6">
                 <CardTitle className="text-lg md:text-2xl font-black text-[#0F172A] uppercase tracking-tighter">Sél. Session</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-16 md:h-20 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-lg md:text-2xl text-primary shadow-inner">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {archivedSessions.map(s => (
                      <SelectItem key={s.year} value={s.year} className="font-black text-lg">{s.year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-6 rounded-2xl bg-primary text-white shadow-2xl space-y-2 group overflow-hidden relative">
                   <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:rotate-6 transition-transform">
                      <ShieldCheck size={80} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">État de l'archive</p>
                   <p className="text-lg md:text-2xl font-black tracking-tighter">DONNÉES CERTIFIÉES</p>
                </div>
              </div>
           </Card>

           <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <ArchiveStatCard title="Total Élèves" value={archivedSessions.find(s => s.year === selectedYear)?.students || "--"} icon={Users} delay="0s" />
              <ArchiveStatCard title="Moyenne G." value={archivedSessions.find(s => s.year === selectedYear)?.avg || "--"} icon={BarChart3} delay="0.1s" />
              <ArchiveStatCard title="Progression" value={archivedSessions.find(s => s.year === selectedYear)?.performance || "--"} icon={ArrowRight} delay="0.2s" />

              <Card className="md:col-span-3 vivid-box border-none shadow-2xl bg-white/95 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] min-h-[300px] md:min-h-[450px] flex flex-col justify-center items-center text-center space-y-8 md:space-y-12">
                 <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center border-4 border-slate-100 shadow-inner group">
                    <FileText className="w-10 h-10 md:w-16 md:h-16 text-slate-200 group-hover:text-primary transition-colors duration-500" />
                 </div>
                 <div className="space-y-4 md:space-y-6">
                    <h3 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase">Registre Session {selectedYear}</h3>
                    <p className="text-slate-400 font-black text-sm md:text-xl uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                       Accédez aux listes nominatives, relevés de notes et bilans comptables de la session clôturée.
                    </p>
                 </div>
                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <Button className="h-16 md:h-20 px-8 md:px-12 bg-primary hover:bg-slate-900 text-white font-black text-sm md:text-xl uppercase rounded-2xl shadow-2xl transition-all border-4 border-white/10">
                       <Download className="w-6 h-6 md:w-9 md:h-9 mr-3" /> Exporter le Bilan
                    </Button>
                    <Button variant="outline" className="h-16 md:h-20 px-8 md:px-12 border-4 border-slate-100 text-[#0F172A] font-black text-sm md:text-xl uppercase rounded-2xl shadow-xl hover:bg-slate-50">
                       Consulter Détails
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ArchiveStatCard({ title, value, icon: Icon, delay }: any) {
  return (
    <Card className="vivid-box border-none shadow-2xl bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] animate-fade-up hover:scale-[1.02] transition-all" style={{ animationDelay: delay }}>
       <div className="flex justify-between items-start mb-6 md:mb-10">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
             <Icon className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <Badge className="bg-slate-900 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest h-8 px-4 flex items-center shadow-lg">Certifié</Badge>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em]">{title}</p>
          <h3 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{value}</h3>
       </div>
    </Card>
  );
}
