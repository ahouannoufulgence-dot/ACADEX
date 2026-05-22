
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookOpen, Download, Printer, ShieldCheck, Star, Clock, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ReportCardPage() {
  const trimesters = [
    { id: 2, name: "Trimestre 2", status: "Actuel", avg: "14.85", rank: "4ème", date: "20 Mars 2024", color: "border-accent bg-accent/5" },
    { id: 1, name: "Trimestre 1", status: "Archivé", avg: "14.25", rank: "6ème", date: "15 Déc. 2023", color: "border-slate-100 bg-white" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2 tracking-tight">Bulletins Officiels</h1>
            <p className="text-slate-500 text-lg font-medium">Consultez et téléchargez vos rapports certifiés.</p>
          </div>
          <Badge className="bg-[#14532D] text-white font-bold h-10 px-6 rounded-xl flex gap-2 shadow-lg">
            <ShieldCheck className="w-5 h-5" /> Documents Certifiés
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Focused Bulletin */}
          <Card className="lg:col-span-2 premium-card border-none shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                <Star size={200} className="text-[#14532D]" />
             </div>
             <CardHeader className="p-10 md:p-12">
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <Badge className="bg-accent text-white mb-4 px-4 py-1 font-bold text-[10px] tracking-widest uppercase">Bulletin Actuel</Badge>
                      <CardTitle className="text-4xl md:text-5xl font-headline font-black text-[#111827] mb-2">{trimesters[0].name}</CardTitle>
                      <CardDescription className="text-lg font-medium text-slate-500">Session Académique 2023-2024</CardDescription>
                   </div>
                   <div className="p-5 rounded-3xl bg-[#14532D] text-white shadow-2xl rotate-3">
                      <BookOpen className="w-10 h-10" />
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-10 md:p-12 pt-0 relative z-10">
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-inner space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moyenne Générale</p>
                      <p className="text-5xl font-headline font-black text-[#14532D]">{trimesters[0].avg}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-inner space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position de Classe</p>
                      <p className="text-5xl font-headline font-black text-accent">{trimesters[0].rank}</p>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                   <Button className="flex-1 bg-[#14532D] hover:bg-[#166534] text-white font-bold h-16 rounded-2xl shadow-xl text-lg gap-3">
                      <Download className="w-6 h-6" /> Télécharger PDF
                   </Button>
                   <Button variant="outline" className="flex-1 border-slate-200 text-[#111827] font-bold h-16 rounded-2xl text-lg gap-3 bg-white">
                      <Printer className="w-6 h-6" /> Imprimer
                   </Button>
                </div>
             </CardContent>
          </Card>

          {/* Sidebar - Archive / History */}
          <div className="space-y-6">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Historique des Bulletins
             </h3>
             {trimesters.slice(1).map((trim) => (
                <Card key={trim.id} className="premium-card border-none hover:translate-x-2 transition-transform cursor-pointer">
                   <CardContent className="p-8 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#111827]">
                            <FileText className="w-7 h-7 opacity-20" />
                         </div>
                         <div>
                            <p className="font-bold text-[#111827] text-lg">{trim.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{trim.date}</p>
                         </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                         <div>
                            <p className="text-xs font-black text-[#14532D]">{trim.avg}</p>
                            <Badge variant="outline" className="text-[8px] h-4 font-bold uppercase tracking-tighter">{trim.status}</Badge>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                   </CardContent>
                </Card>
             ))}
             
             <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex gap-4 items-start shadow-sm mt-10">
                <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                   <strong>Authenticité :</strong> Tous les bulletins téléchargés sur ACADEX portent une signature numérique infalsifiable garantissant leur validité auprès des institutions.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
