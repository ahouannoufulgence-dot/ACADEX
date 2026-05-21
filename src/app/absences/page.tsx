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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Suivi des Absences</h1>
            <p className="text-muted-foreground">Registre des présences et retards.</p>
          </div>
          <Button className="bg-destructive hover:bg-destructive/90 text-white font-bold">
            <ShieldAlert className="w-4 h-4 mr-2" /> Signaler une absence
          </Button>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher un élève..." className="pl-10 bg-white/5 border-white/10" />
              </div>
              <Button variant="outline" className="border-white/10 text-white">
                <Calendar className="w-4 h-4 mr-2" /> Mars 2024
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Élève</TableHead>
                    <TableHead className="text-white">Classe</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Durée</TableHead>
                    <TableHead className="text-white">Statut</TableHead>
                    <TableHead className="text-right text-white">Motif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((a, i) => (
                    <TableRow key={i} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-bold text-white">{a.student}</TableCell>
                      <TableCell className="text-white/60">{a.class}</TableCell>
                      <TableCell className="text-white/60">{a.date}</TableCell>
                      <TableCell className="text-white/60">{a.duration}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          a.status === "Justifié" ? "bg-accent/20 text-accent border-accent/20" : "bg-destructive/20 text-destructive border-destructive/20"
                        )} variant="outline">
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{a.reason}</TableCell>
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
