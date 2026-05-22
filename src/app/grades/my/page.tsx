"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Trophy, Target, AlertCircle, TrendingUp, Star, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MyGradesPage() {
  const grades = [
    { subject: "Mathématiques", note: 16.5, avg: 12.4, high: 19, low: 0.5, rank: "3/42", coeff: 4 },
    { subject: "Français", note: 14.0, avg: 11.2, high: 17, low: 4.5, rank: "8/42", coeff: 4 },
    { subject: "Physique-Chimie", note: 18.0, avg: 10.8, high: 20, low: 3.0, rank: "1/42", coeff: 3 },
    { subject: "Anglais", note: 9.5, avg: 13.5, high: 18.5, low: 8, rank: "35/42", coeff: 2 },
    { subject: "SVT", note: 11.5, avg: 10.5, high: 16, low: 6, rank: "12/42", coeff: 2 },
  ];

  const getNoteColor = (note: number) => {
    if (note >= 14) return "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20";
    if (note >= 10) return "text-[#111827] bg-[#111827]/5 border-[#111827]/10";
    return "text-[#B91C1C] bg-[#B91C1C]/10 border-[#B91C1C]/20";
  };

  const getMention = (avg: number) => {
    if (avg >= 16) return { text: "Très Bien", color: "bg-[#16A34A]" };
    if (avg >= 14) return { text: "Bien", color: "bg-[#14532D]" };
    if (avg >= 12) return { text: "Assez Bien", color: "bg-[#111827]" };
    if (avg >= 10) return { text: "Passable", color: "bg-slate-400" };
    return { text: "Insuffisant", color: "bg-[#B91C1C]" };
  };

  const generalAvg = 14.85;
  const mention = getMention(generalAvg);

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Mon Relevé de Notes</h1>
            <p className="text-slate-500 text-lg font-medium">Trimestre 2 • Session 2023 / 2024</p>
          </div>
          <Card className="premium-card p-2 flex items-center border-none bg-white shadow-2xl">
            <div className="px-10 py-6 border-r border-slate-100 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Moyenne Générale</p>
              <p className="text-5xl font-headline font-bold text-[#14532D]">{generalAvg}</p>
            </div>
            <div className="px-10 py-6 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Mention Finale</p>
              <Badge className={cn("text-white font-bold h-8 px-6 rounded-xl text-xs uppercase tracking-widest", mention.color)}>{mention.text}</Badge>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatMiniCard icon={Trophy} label="Rang dans la classe" value="4ème / 42" color="text-[#14532D]" />
          <StatMiniCard icon={Star} label="Points Cumulés" value="214.50" color="text-[#111827]" />
          <StatMiniCard icon={TrendingUp} label="Progression" value="+1.2 pts" color="text-[#16A34A]" />
        </div>

        <Card className="premium-card">
          <CardHeader className="p-10 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent/10">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Détails des Évaluations</CardTitle>
                <CardDescription className="text-lg">Performance détaillée par matière et comparaison avec la classe.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-inner bg-slate-50/20">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[#111827] font-bold h-16 pl-8">Matière</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Note / 20</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Coeff</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Moy. Classe</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Min/Max</TableHead>
                    <TableHead className="text-right text-[#111827] font-bold h-16 pr-8">Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-white transition-all duration-200 border-slate-50 group">
                      <TableCell className="font-bold text-[#111827] text-lg py-6 pl-8">{item.subject}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-base font-black w-16 h-10 justify-center border-none shadow-sm rounded-xl", getNoteColor(item.note))}>
                          {item.note}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-500">{item.coeff}</TableCell>
                      <TableCell className="text-center font-bold text-slate-500">{item.avg}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                          <span className="text-[#B91C1C] bg-red-50 px-3 py-1 rounded-lg">{item.low}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-[#16A34A] bg-green-50 px-3 py-1 rounded-lg">{item.high}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black text-[#111827] pr-8 text-xl">{item.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="premium-card p-10 flex items-center gap-8 border-none shadow-xl hover:translate-y-[-6px] transition-transform">
      <div className={cn("p-5 rounded-2xl bg-slate-50 shadow-inner group-hover:bg-white transition-colors", color)}>
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2">{label}</p>
        <p className="text-3xl font-headline font-bold text-[#111827]">{value}</p>
      </div>
    </Card>
  );
}