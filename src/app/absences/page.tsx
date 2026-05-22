"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AbsencesPage() {
  const absences = [
    { student: "Dossou Marc", class: "6ème D", date: "12/03/2024", duration: "2h", status: "Justifié", reason: "Maladie" },
    { student: "Koffi Amé", class: "3ème A", date: "11/03/2024", duration: "1 journée", status: "Non Justifié", reason: "-" },
    { student: "Sika Marielle", class: "Tle D", date: "10/03/2024", duration: "4h", status: "Justifié", reason: "Compétition" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">Suivi des Absences</h1>
            <p className="text-slate-500 font-medium">Registre des présences et retards.</p>
          </div>
          <Button className="bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold h-12 px-6 rounded-xl shadow-lg transition-all active:scale-95">
            <ShieldAlert className="w-4 h-4 mr-2" /> Signaler une absence
          </Button>
        </div>

        <Card className="premium-card border-none shadow-xl">
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Rechercher un élève..." className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl" />
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-600 h-11 px-6 rounded-xl">
                <Calendar className="w-4 h-4 mr-2" /> Mars 2024
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[#111827] font-bold">Élève</TableHead>
                    <TableHead className="text-[#111827] font-bold">Classe</TableHead>
                    <TableHead className="text-[#111827] font-bold">Date</TableHead>
                    <TableHead className="text-[#111827] font-bold">Durée</TableHead>
                    <TableHead className="text-[#111827] font-bold">Statut</TableHead>
                    <TableHead className="text-right text-[#111827] font-bold">Motif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((a, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors border-slate-50">
                      <TableCell className="font-bold text-[#111827]">{a.student}</TableCell>
                      <TableCell className="text-slate-600">{a.class}</TableCell>
                      <TableCell className="text-slate-600">{a.date}</TableCell>
                      <TableCell className="text-slate-600">{a.duration}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-bold h-6 px-3 uppercase tracking-wider",
                          a.status === "Justifié" 
                            ? "bg-green-50 text-[#14532D] border-green-100" 
                            : "bg-red-50 text-[#B91C1C] border-red-100 animate-pulse"
                        )} variant="outline">
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-500 italic">{a.reason}</TableCell>
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