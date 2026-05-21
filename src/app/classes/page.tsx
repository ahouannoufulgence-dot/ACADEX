"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClipboardList, Plus, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClassesPage() {
  const classes = [
    { name: "6ème D", students: 45, teacher: "Mme Soglo", room: "S01", performance: "11.2/20" },
    { name: "3ème A", students: 38, teacher: "M. Kouassi", room: "S05", performance: "12.5/20" },
    { name: "1ère C", students: 32, teacher: "M. Amoussou", room: "Labo 1", performance: "10.8/20" },
    { name: "Tle D", students: 40, teacher: "M. Kossou", room: "S12", performance: "13.1/20" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Gestion des Classes</h1>
            <p className="text-muted-foreground">Organisation pédagogique et salles.</p>
          </div>
          <Button className="bg-primary text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Classe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((c, i) => (
            <Card key={i} className="glass-card border-none hover:translate-y-[-4px] transition-all cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline text-accent">{c.name}</CardTitle>
                <CardDescription className="text-xs">Titulaire: {c.teacher}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Effectif
                  </span>
                  <span className="text-white font-bold">{c.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Performance
                  </span>
                  <span className="text-accent font-bold">{c.performance}</span>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs h-8 border-white/10">Liste</Button>
                  <Button variant="outline" className="flex-1 text-xs h-8 border-white/10">Calendrier</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}