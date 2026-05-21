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
  ];

  const getNoteColor = (note: number) => {
    if (note >= 14) return "text-accent bg-accent/10 border-accent/20";
    if (note >= 10) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  const getMention = (avg: number) => {
    if (avg >= 16) return { text: "Très Bien", color: "bg-accent" };
    if (avg >= 14) return { text: "Bien", color: "bg-accent/80" };
    if (avg >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
    if (avg >= 10) return { text: "Passable", color: "bg-amber-500" };
    return { text: "Insuffisant", color: "bg-destructive" };
  };

  const generalAvg = 14.85;
  const mention = getMention(generalAvg);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Mes Résultats Scolaires</h1>
            <p className="text-muted-foreground">Trimestre 2 - Session 2023/2024</p>
          </div>
          <div className="p-4 rounded-2xl glass-card flex items-center gap-6 border-none shadow-xl">
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Moyenne</p>
              <p className="text-3xl font-headline font-bold text-accent">{generalAvg}</p>
            </div>
            <div className="text-center pr-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Mention</p>
              <Badge className={cn("text-white font-bold", mention.color)}>{mention.text}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatMiniCard icon={Trophy} label="Rang Global" value="4ème / 42" color="text-accent" />
          <StatMiniCard icon={Target} label="Points Totaux" value="214.5" color="text-blue-400" />
          <StatMiniCard icon={AlertCircle} label="Progression" value="+1.2 pts" color="text-purple-400" />
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Détail par Matière
            </CardTitle>
            <CardDescription>Consultez vos notes et votre position par rapport à la classe.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Matière</TableHead>
                    <TableHead className="text-white">Note / 20</TableHead>
                    <TableHead className="text-white">Coeff</TableHead>
                    <TableHead className="text-white">Moy. Classe</TableHead>
                    <TableHead className="text-white">Min/Max</TableHead>
                    <TableHead className="text-right text-white">Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-medium text-white">{item.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-sm font-bold w-12 justify-center", getNoteColor(item.note))}>
                          {item.note}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/60">{item.coeff}</TableCell>
                      <TableCell className="text-white/60">{item.avg}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="text-destructive">{item.low}</span>
                        <span className="mx-1">/</span>
                        <span className="text-accent">{item.high}</span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-white">{item.rank}</TableCell>
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
    <div className="p-4 rounded-xl glass-card flex items-center gap-4 border-none">
      <div className={cn("p-2.5 rounded-lg bg-white/5", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-bold">{label}</p>
        <p className="text-xl font-headline font-bold text-white">{value}</p>
      </div>
    </div>
  );
}