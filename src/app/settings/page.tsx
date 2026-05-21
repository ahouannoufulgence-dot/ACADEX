"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Save, Trash2, Edit2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [coefficients, setCoefficients] = useState([
    { id: 1, subject: "Mathématiques", coeff: 4, level: "Lycée" },
    { id: 2, subject: "Français", coeff: 4, level: "Lycée" },
    { id: 3, subject: "Physique-Chimie", coeff: 3, level: "Lycée" },
    { id: 4, subject: "SVT", coeff: 3, level: "Lycée" },
    { id: 5, subject: "Anglais", coeff: 2, level: "Lycée" },
  ]);

  const [newSub, setNewSub] = useState({ subject: "", coeff: "", level: "Lycée" });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newSub.subject || !newSub.coeff) return;
    setCoefficients([...coefficients, { ...newSub, id: Date.now(), coeff: Number(newSub.coeff) } as any]);
    setNewSub({ subject: "", coeff: "", level: "Lycée" });
    toast({ title: "Ajouté", description: "La matière a été ajoutée avec succès." });
  };

  const handleDelete = (id: number) => {
    setCoefficients(coefficients.filter(c => c.id !== id));
    toast({ title: "Supprimé", description: "Coefficient retiré." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Paramètres Académiques</h1>
          <p className="text-muted-foreground">Gestion des coefficients et configuration du système.</p>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Coefficients Scolaires
            </CardTitle>
            <CardDescription>
              Modifiez les coefficients pour le calcul automatique des moyennes et rangs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase">Matière</label>
                <Input 
                  placeholder="Ex: Philosophie" 
                  className="bg-background/50"
                  value={newSub.subject}
                  onChange={e => setNewSub({...newSub, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase">Coefficient</label>
                <Input 
                  type="number" 
                  placeholder="Ex: 2" 
                  className="bg-background/50"
                  value={newSub.coeff}
                  onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase">Niveau</label>
                <Input 
                  placeholder="Collège / Lycée" 
                  className="bg-background/50"
                  value={newSub.level}
                  onChange={e => setNewSub({...newSub, level: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Matière</TableHead>
                    <TableHead className="text-white">Coefficient</TableHead>
                    <TableHead className="text-white">Niveau</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coefficients.map((item) => (
                    <TableRow key={item.id} className="hover:bg-white/5 border-white/5">
                      <TableCell className="font-medium text-white">{item.subject}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded bg-accent/20 text-accent font-bold text-xs">
                          {item.coeff}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.level}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-blue-500/20 text-blue-400">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-destructive/20 text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-accent hover:bg-accent/90 text-black font-bold px-8">
                <Save className="w-4 h-4 mr-2" /> Sauvegarder la configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}