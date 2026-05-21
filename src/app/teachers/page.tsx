"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, UserPlus, Search, Mail, Phone, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function TeachersPage() {
  const teachers = [
    { id: "ENS-MATH-001", name: "M. Kouassi", subject: "Mathématiques", classes: "3ème A, 1ère C", status: "Présent" },
    { id: "ENS-FRAN-002", name: "Mme. Soglo", subject: "Français", classes: "6ème D, 4ème B", status: "En cours" },
    { id: "ENS-PHYS-003", name: "M. Amoussou", subject: "Physique-Chimie", classes: "Tle D, 2nde C", status: "Absent" },
    { id: "ENS-ANGL-004", name: "Mme. Gnonlonfoun", subject: "Anglais", classes: "3ème D, 5ème A", status: "Présent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Corps Enseignant</h1>
            <p className="text-muted-foreground">Gestion des professeurs et de leurs affectations.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
            <UserPlus className="w-4 h-4 mr-2" /> Nouvel Enseignant
          </Button>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom ou matière..." className="pl-10 bg-white/5 border-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Enseignant</TableHead>
                    <TableHead className="text-white">Matière</TableHead>
                    <TableHead className="text-white">Classes</TableHead>
                    <TableHead className="text-white">Statut</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((t) => (
                    <TableRow key={t.id} className="hover:bg-white/5 border-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-white">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{t.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{t.subject}</TableCell>
                      <TableCell className="text-white/60 text-xs">{t.classes}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          t.status === "Présent" ? "bg-accent/20 text-accent" : 
                          t.status === "En cours" ? "bg-blue-400/20 text-blue-400" :
                          "bg-destructive/20 text-destructive"
                        )} variant="outline">
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
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