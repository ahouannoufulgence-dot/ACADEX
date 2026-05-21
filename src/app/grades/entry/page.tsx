"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Save, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GradesEntryPage() {
  const students = [
    { id: "ELV-3A-001", name: "Agbéssy Paul", grade: "" },
    { id: "ELV-3A-002", name: "Koffi Amé", grade: "" },
    { id: "ELV-3A-003", name: "Sika Marielle", grade: "" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Saisie des Notes</h1>
            <p className="text-muted-foreground">Enregistrez les évaluations par classe et matière.</p>
          </div>
          <Button className="bg-primary text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> Publier les notes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 glass-card border-none shadow-xl h-fit">
            <CardHeader>
              <CardTitle className="text-white text-lg">Sélection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Classe</label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Choisir une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3a">3ème A</SelectItem>
                    <SelectItem value="1c">1ère C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Évaluation</label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Type de devoir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="int1">Interrogation 1</SelectItem>
                    <SelectItem value="dev1">Devoir Surveillé 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-accent text-black font-bold mt-4">Charger la liste</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Liste de saisie</CardTitle>
              <CardDescription>Classe: 3ème A • Mathématiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead className="text-white">Élève</TableHead>
                      <TableHead className="text-white w-32">Note / 20</TableHead>
                      <TableHead className="text-right text-white">Appréciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s, i) => (
                      <TableRow key={i} className="hover:bg-white/5 border-white/5">
                        <TableCell className="font-bold text-white">{s.name}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            max="20" 
                            placeholder="00.00" 
                            className="bg-white/5 border-white/10 h-8 text-center text-accent font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input placeholder="Encourageant" className="bg-white/5 border-white/10 h-8 text-xs text-right" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}