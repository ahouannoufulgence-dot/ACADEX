"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookOpen, Download, Printer, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportCardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Bulletins Scolaires</h1>
            <p className="text-muted-foreground">Consultez et téléchargez vos rapports officiels.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((trim) => (
            <Card key={trim} className="glass-card border-none shadow-xl overflow-hidden group">
              <div className="h-2 bg-primary group-hover:bg-accent transition-colors" />
              <CardHeader>
                <CardTitle className="text-white">Trimestre {trim}</CardTitle>
                <CardDescription>Session 2023-2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Moyenne</p>
                    <p className="text-2xl font-headline font-bold text-white">{trim === 1 ? "14.25" : "14.85"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Rang</p>
                    <p className="text-2xl font-headline font-bold text-accent">{trim === 1 ? "6ème" : "4ème"}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary text-white font-bold h-11">
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/10 text-white h-11">
                    <Printer className="w-4 h-4 mr-2" /> Imprimer
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/5 p-2 rounded-lg">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  <span>Document certifié numériquement par ACADEX</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}