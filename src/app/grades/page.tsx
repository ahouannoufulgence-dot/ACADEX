"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Search, TrendingUp, Filter, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function GradesPage() {
  const summary = [
    { class: "3ème A", avg: "12.8", high: "18.5", status: "Terminé" },
    { class: "1ère C", avg: "10.4", high: "16.0", status: "En cours" },
    { class: "Tle D", avg: "13.2", high: "19.0", status: "Terminé" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Notes & Résultats</h1>
            <p className="text-muted-foreground">Suivi académique global de l'établissement.</p>
          </div>
          <Button className="bg-accent text-black font-bold">
            <TrendingUp className="w-4 h-4 mr-2" /> Analyser les performances
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summary.map((s, i) => (
            <Card key={i} className="glass-card border-none">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">{s.class}</p>
                    <h3 className="text-2xl font-headline font-bold text-white">{s.avg} / 20</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 text-accent" />
                  <span>Meilleure note: <span className="text-white font-bold">{s.high}</span></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher une classe..." className="pl-10 bg-white/5 border-white/10" />
              </div>
              <Button variant="outline" className="border-white/10 text-white">
                <Filter className="w-4 h-4 mr-2" /> Trimestre 2
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
               <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Classe</TableHead>
                    <TableHead className="text-white">Moyenne Générale</TableHead>
                    <TableHead className="text-white">Progression</TableHead>
                    <TableHead className="text-white">Bulletins</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-bold text-white">{item.class}</TableCell>
                      <TableCell className="text-accent font-bold">{item.avg}</TableCell>
                      <TableCell className="text-white/60">+0.4 pts</TableCell>
                      <TableCell className="text-white/60">{item.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="text-accent h-auto p-0 font-bold">Détails</Button>
                      </TableCell>
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