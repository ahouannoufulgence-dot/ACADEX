"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Search, Download, Plus, Filter, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const recentPayments = [
    { id: "PAY-901", student: "Koffi Amé", class: "3ème A", amount: "50,000", date: "Ce matin", status: "Confirmé" },
    { id: "PAY-898", student: "Sika Marielle", class: "Tle D", amount: "120,000", date: "Hier", status: "Confirmé" },
    { id: "PAY-885", student: "Dossou Marc", class: "6ème D", amount: "45,000", date: "Il y a 2j", status: "Confirmé" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">Comptabilité Scolaire</h1>
            <p className="text-slate-500 font-medium">Suivi des encaissements et frais de scolarité.</p>
          </div>
          <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Enregistrer un versement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="premium-card p-6 border-none shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Journalier</p>
            <p className="text-3xl font-headline font-bold text-[#14532D]">845,000 F</p>
          </Card>
          <Card className="premium-card p-6 border-none shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Trimestre</p>
            <p className="text-3xl font-headline font-bold text-[#111827]">12.4M F</p>
          </Card>
          <Card className="premium-card p-6 border-none shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Taux Recouvrement</p>
            <p className="text-3xl font-headline font-bold text-[#14532D]">72%</p>
          </Card>
          <Card className="premium-card p-6 border-none shadow-xl border-l-4 border-l-[#B91C1C]">
            <p className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-widest mb-2">Impayés Critiques</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-headline font-bold text-[#B91C1C]">4.2M F</p>
              <AlertCircle className="w-6 h-6 text-[#B91C1C] animate-pulse" />
            </div>
          </Card>
        </div>

        <Card className="premium-card border-none shadow-xl">
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Rechercher par élève ou ID..." className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-200 text-slate-600 rounded-xl h-11 px-6">
                  <Filter className="w-4 h-4 mr-2" /> Filtre avancé
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-600 rounded-xl h-11 px-4">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[#111827] font-bold">ID Reçu</TableHead>
                    <TableHead className="text-[#111827] font-bold">Élève</TableHead>
                    <TableHead className="text-[#111827] font-bold">Classe</TableHead>
                    <TableHead className="text-[#111827] font-bold">Montant (FCFA)</TableHead>
                    <TableHead className="text-[#111827] font-bold">Date</TableHead>
                    <TableHead className="text-right text-[#111827] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                      <TableCell className="font-mono text-xs text-slate-400">{p.id}</TableCell>
                      <TableCell className="font-bold text-[#111827]">{p.student}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{p.class}</TableCell>
                      <TableCell className="font-bold text-[#14532D]">{p.amount}</TableCell>
                      <TableCell className="text-slate-600">{p.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#14532D]">
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