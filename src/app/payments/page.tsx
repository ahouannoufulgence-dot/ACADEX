"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Search, Download, Plus, Filter, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminPaymentsPage() {
  const recentPayments = [
    { id: "PAY-901", student: "Koffi Amé", class: "3ème A", amount: "50,000", date: "Ce matin", status: "Confirmé" },
    { id: "PAY-898", student: "Sika Marielle", class: "Tle D", amount: "120,000", date: "Hier", status: "Confirmé" },
    { id: "PAY-885", student: "Dossou Marc", class: "6ème D", amount: "45,000", date: "Il y a 2j", status: "Confirmé" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Comptabilité Scolaire</h1>
            <p className="text-muted-foreground">Suivi des encaissements et frais de scolarité.</p>
          </div>
          <Button className="bg-primary text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Enregistrer un versement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card border-none">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Journalier</p>
              <p className="text-2xl font-headline font-bold text-accent">845,000 F</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-none">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Trimestre</p>
              <p className="text-2xl font-headline font-bold text-white">12.4M F</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-none">
             <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Taux Recouvrement</p>
              <p className="text-2xl font-headline font-bold text-blue-400">72%</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-none">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Impayés</p>
              <p className="text-2xl font-headline font-bold text-destructive">4.2M F</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher par élève ou ID..." className="pl-10 bg-white/5 border-white/10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10 text-white">
                  <Filter className="w-4 h-4 mr-2" /> Filtre avancé
                </Button>
                <Button variant="outline" className="border-white/10 text-white">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Élève</TableHead>
                    <TableHead className="text-white">Classe</TableHead>
                    <TableHead className="text-white">Montant (FCFA)</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((p) => (
                    <TableRow key={p.id} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                      <TableCell className="font-medium text-white">{p.student}</TableCell>
                      <TableCell className="text-white/60">{p.class}</TableCell>
                      <TableCell className="font-bold text-accent">{p.amount}</TableCell>
                      <TableCell className="text-white/60">{p.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
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