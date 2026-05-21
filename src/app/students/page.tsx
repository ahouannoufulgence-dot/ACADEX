"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Search, Filter, GraduationCap, MoreVertical, Mail, UserPlus, Sparkles, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { provisionUserAccount, DirectorAccountProvisioningOutput } from "@/ai/flows/director-account-provisioning-assistant";
import { useToast } from "@/hooks/use-toast";

export default function StudentsPage() {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<DirectorAccountProvisioningOutput | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: ""
  });

  const [students] = useState([
    { id: "ELV-3D-001", name: "Amina Kossou", class: "3ème D", status: "Inscrit", payment: "Payé" },
    { id: "ELV-1C-042", name: "David Mensah", class: "1ère C", status: "Inscrit", payment: "Partiel" },
    { id: "ELV-6A-115", name: "Marie Codjo", class: "6ème A", status: "Inscrit", payment: "Payé" },
    { id: "ELV-TD-204", name: "Théo Bah", class: "Tle D", status: "Inscrit", payment: "Impayé" },
  ]);

  const handleAiProvision = async () => {
    if (!formData.firstName || !formData.lastName || !formData.gradeLevel) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations de l'élève."
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await provisionUserAccount({
        userType: 'ELEVE',
        firstName: formData.firstName,
        lastName: formData.lastName,
        gradeLevel: formData.gradeLevel
      });
      setAiResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur IA",
        description: "Impossible de générer les informations pour le moment."
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papier."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Gestion des Élèves</h1>
            <p className="text-muted-foreground">Effectif total: 842 élèves inscrits cette année.</p>
          </div>
          <div className="flex gap-3">
             <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                  <UserPlus className="w-4 h-4 mr-2" /> Nouvel Élève
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Provisionnement de Compte AI
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    Saisissez les informations pour générer automatiquement un compte et un message de bienvenue.
                  </DialogDescription>
                </DialogHeader>
                
                {!aiResult ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fname">Prénom</Label>
                        <Input 
                          id="fname" 
                          className="bg-white/5 border-white/10" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname">Nom</Label>
                        <Input 
                          id="lname" 
                          className="bg-white/5 border-white/10" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Classe / Niveau</Label>
                      <Input 
                        id="class" 
                        placeholder="Ex: 3ème D" 
                        className="bg-white/5 border-white/10" 
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-xs font-bold text-accent uppercase mb-1">Identifiant Suggéré</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-bold text-white tracking-wider">{aiResult.suggestedId}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(aiResult.suggestedId)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs font-bold text-white/60 uppercase mb-2">Message de Bienvenue</p>
                      <p className="text-sm text-white/80 italic leading-relaxed whitespace-pre-wrap">{aiResult.draftWelcomeMessage}</p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-2 text-accent" 
                        onClick={() => copyToClipboard(aiResult.draftWelcomeMessage)}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copier le message
                      </Button>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {!aiResult ? (
                    <Button 
                      className="bg-accent text-black font-bold w-full" 
                      onClick={handleAiProvision}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? "Génération en cours..." : "Générer avec ACADEX AI"}
                    </Button>
                  ) : (
                    <Button className="bg-primary text-white font-bold w-full" onClick={() => setAiResult(null)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Valider et Enregistrer
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-white/10 text-white">
              <Mail className="w-4 h-4 mr-2" /> Message groupé
            </Button>
          </div>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher un nom ou ID..." className="pl-10 bg-white/5 border-white/10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/10 text-white">
                  <Filter className="w-4 h-4 mr-2" /> Filtrer par classe
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="text-white">Élève</TableHead>
                    <TableHead className="text-white">Identifiant</TableHead>
                    <TableHead className="text-white">Classe</TableHead>
                    <TableHead className="text-white">Scolarité</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id} className="hover:bg-white/5 border-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {s.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-white">{s.class}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          s.payment === "Payé" ? "bg-accent/20 text-accent border-accent/20" : 
                          s.payment === "Partiel" ? "bg-amber-400/20 text-amber-400 border-amber-400/20" :
                          "bg-destructive/20 text-destructive border-destructive/20"
                        )} variant="outline">
                          {s.payment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
