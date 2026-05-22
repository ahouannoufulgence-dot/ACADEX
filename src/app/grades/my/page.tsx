"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Trophy, Target, AlertCircle } from "lucide-react";
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
    if (note >= 14) return "text-[#1A6B4A] bg-[#1A6B4A]/10 border-[#1A6B4A]/20";
    if (note >= 10) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]/20";
  };

  const getMention = (avg: number) => {
    if (avg >= 16) return { text: "Très Bien", color: "bg-[#1A6B4A]" };
    if (avg >= 14) return { text: "Bien", color: "bg-[#1A6B4A]/80" };
    if (avg >= 12) return { text: "Assez Bien", color: "bg-blue-600" };
    if (avg >= 10) return { text: "Passable", color: "bg-orange-500" };
    return { text: "Insuffisant", color: "bg-[#DC2626]" };
  };

  const generalAvg = 14.85;
  const mention = getMention(generalAvg);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-2">Mes Résultats Scolaires</h1>
            <p className="text-slate-500 font-medium">Trimestre 2 - Session 2023/2024</p>
          </div>
          <Card className="p-4 premium-card flex items-center gap-6 border-none">
            <div className="text-center px-4 border-r border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Moyenne</p>
              <p className="text-3xl font-headline font-bold text-[#1A6B4A]">{generalAvg}</p>
            </div>
            <div className="text-center pr-4">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Mention</p>
              <Badge className={cn("text-white font-bold h-6", mention.color)}>{mention.text}</Badge>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatMiniCard icon={Trophy} label="Rang Global" value="4ème / 42" color="text-[#1A6B4A]" />
          <StatMiniCard icon={Target} label="Points Totaux" value="214.5" color="text-blue-600" />
          <StatMiniCard icon={AlertCircle} label="Progression" value="+1.2 pts" color="text-purple-600" />
        </div>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1F2937] text-lg">
              <FileText className="w-5 h-5 text-[#1A6B4A]" />
              Détail par Matière
            </CardTitle>
            <CardDescription>Consultez vos notes et votre position par rapport à la classe.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F5F7F9]">
                  <TableRow>
                    <TableHead className="text-[#1F2937] font-bold">Matière</TableHead>
                    <TableHead className="text-[#1F2937] font-bold">Note / 20</TableHead>
                    <TableHead className="text-[#1F2937] font-bold">Coeff</TableHead>
                    <TableHead className="text-[#1F2937] font-bold">Moy. Classe</TableHead>
                    <TableHead className="text-[#1F2937] font-bold">Min/Max</TableHead>
                    <TableHead className="text-right text-[#1F2937] font-bold">Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-[#F5F7F9] transition-colors">
                      <TableCell className="font-semibold text-[#1F2937]">{item.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-sm font-bold w-12 justify-center border-none", getNoteColor(item.note))}>
                          {item.note}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">{item.coeff}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{item.avg}</TableCell>
                      <TableCell className="text-[11px] font-medium">
                        <span className="text-[#DC2626]">{item.low}</span>
                        <span className="mx-1 text-slate-300">/</span>
                        <span className="text-[#1A6B4A]">{item.high}</span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-[#1F2937]">{item.rank}</TableCell>
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
    <Card className="p-4 premium-card flex items-center gap-4">
      <div className={cn("p-2.5 rounded-lg bg-slate-50", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-xl font-headline font-bold text-[#1F2937]">{value}</p>
      </div>
    </Card>
  );
}
