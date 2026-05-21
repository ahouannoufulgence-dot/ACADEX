"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClipboardList, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyClassesPage() {
  const myClasses = [
    { name: "3ème A", subject: "Mathématiques", nextClass: "Aujourd'hui, 08:00", count: 38 },
    { name: "1ère C", subject: "Mathématiques", nextClass: "Demain, 10:00", count: 32 },
    { name: "Tle D", subject: "Mathématiques", nextClass: "Jeudi, 14:00", count: 40 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Mes Classes & Cours</h1>
          <p className="text-muted-foreground">Gérez vos classes et accédez à vos listes d'élèves.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClasses.map((c, i) => (
            <Card key={i} className="glass-card border-none shadow-xl hover:scale-[1.02] transition-transform">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-2xl">{c.name}</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <CardDescription className="text-accent font-bold">{c.subject}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Prochain cours: <span className="text-white">{c.nextClass}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{c.count} élèves inscrits</span>
                </div>
                <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 border-white/10 text-white font-bold">
                  Liste des élèves <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}