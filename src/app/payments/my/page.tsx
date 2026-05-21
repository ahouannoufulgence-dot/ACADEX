"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Download, CheckCircle, Clock, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyPaymentsPage() {
  const payments = [
    { id: "REC-001", date: "15/09/2023", amount: 150000, type: "Tranche 1", status: "Payé" },
    { id: "REC-042", date: "12/12/2023", amount: 100000, type: "Tranche 2", status: "Payé" },
    { id: "REC-105", date: "05/02/2024", amount: 50000, type: "Tranche 3", status: "Partiel" },
  ];

  const totalDue = 350000;
  const totalPaid = 300000;
  const balance = totalDue - totalPaid;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Situation Financière</h1>
          <p className="text-muted-foreground">Consultez l'historique de vos versements et le solde restant.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative group">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Wallet size={160} />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Montant Total Scolarité</p>
              <p className="text-3xl font-headline font-bold">{totalDue.toLocaleString()} FCFA</p>
            </CardContent>
          </Card>

          <Card className="bg-accent text-black border-none shadow-xl overflow-hidden relative group">
             <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
              <CheckCircle size={160} />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-black/60 text-xs font-bold uppercase mb-1">Total Déjà Versé</p>
              <p className="text-3xl font-headline font-bold">{totalPaid.toLocaleString()} FCFA</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 shadow-xl overflow-hidden relative group">
             <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Clock size={160} />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-white/40 text-xs font-bold uppercase mb-1">Reste à Payer</p>
              <p className="text-3xl font-headline font-bold text-destructive">{balance.toLocaleString()} FCFA</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Historique des Versements
            </CardTitle>
            <CardDescription>L'application confirme uniquement les paiements physiques effectués à l'école.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <CheckCircle className={cn("w-5 h-5", p.status === "Payé" ? "text-accent" : "text-amber-400")} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.type}</p>
                      <p className="text-xs text-muted-foreground">Reçu: {p.id} • {p.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{p.amount.toLocaleString()} FCFA</p>
                      <Badge className={cn("text-[10px] h-4", p.status === "Payé" ? "bg-accent/20 text-accent" : "bg-amber-400/20 text-amber-400")}>
                        {p.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <p className="text-sm text-white/80">
                Veuillez présenter vos reçus physiques à la comptabilité pour toute réclamation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}