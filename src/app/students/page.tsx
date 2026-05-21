"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Filter, MoreVertical, Mail, UserPlus, Sparkles, Copy, CheckCircle } from "lucide-react";
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
import { useFirestore, useCollection } from "@/firebase";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function StudentsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<DirectorAccountProvisioningOutput | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: ""
  });

  const studentsQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "students");
  }, [db]);

  const { data: students, loading } = useCollection(studentsQuery);

  // Optimisation : Tri et filtrage mémorisés pour la rapidité
  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];
    
    let result = [...students];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        (s.firstName?.toLowerCase().includes(q)) || 
        (s.lastName?.toLowerCase().includes(q)) || 
        (s.id?.toLowerCase().includes(q))
      );
    }

    return result.sort((a: any, b: any) => {
      const nameA = `${a.lastName || ""} ${a.firstName || ""}`.toLowerCase().trim();
      const nameB = `${b.lastName || ""} ${b.firstName || ""}`.toLowerCase().trim();
      if (!nameA && !nameB) return a.id.localeCompare(b.id);
      if (!nameA) return 1;
      if (!nameB) return -1;
      return nameA.localeCompare(nameB);
    });
  }, [students, searchQuery]);

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

  const saveStudent = useCallback(() => {
    if (!db || !aiResult) return;

    const studentId = aiResult.suggestedId;
    const studentRef = doc(db, "students", studentId);
    const studentData = {
      id: studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gradeLevel: formData.gradeLevel,
      status: "Inscrit",
      paymentStatus: "Impayé",
      createdAt: serverTimestamp()
    };

    // Mutation non-bloquante pour une réactivité maximale
    setDoc(studentRef, studentData)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({
      title: "Élève enregistré",
      description: `${formData.firstName} ${formData.lastName} a été ajouté avec succès.`
    });
    setAiResult(null);
    setFormData({ firstName: "", lastName: "", gradeLevel: "" });
  }, [db, aiResult, formData, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'identifiant a été copié."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-1">Gestion des Élèves</h1>
            <p className="text-muted-foreground text-sm">Effectif actuel: {students?.length || 0} enregistrés.</p>
          </div>
          <div className="flex gap-2">
             <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6">
                  <UserPlus className="w-4 h-4 mr-2" /> Nouvel Élève
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Provisionnement IA
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    Générez automatiquement un compte élève optimisé.
                  </DialogDescription>
                </DialogHeader>
                
                {!aiResult ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fname">Prénom</Label>
                        <Input 
                          id="fname" 
                          className="bg-white/5 border-white/10 h-11" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname">Nom</Label>
                        <Input 
                          id="lname" 
                          className="bg-white/5 border-white/10 h-11" 
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
                        className="bg-white/5 border-white/10 h-11" 
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-[10px] font-bold text-accent uppercase mb-1">Identifiant Suggéré</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-bold text-white tracking-wider">{aiResult.suggestedId}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(aiResult.suggestedId)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-bold text-white/60 uppercase mb-2">Message de Bienvenue</p>
                      <p className="text-sm text-white/80 italic leading-relaxed whitespace-pre-wrap">{aiResult.draftWelcomeMessage}</p>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {!aiResult ? (
                    <Button 
                      className="bg-accent text-black font-bold w-full h-11" 
                      onClick={handleAiProvision}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? "Génération..." : "Générer avec ACADEX AI"}
                    </Button>
                  ) : (
                    <Button className="bg-primary text-white font-bold w-full h-11" onClick={saveStudent}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Confirmer l'enregistrement
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-white/10 text-white h-10">
              <Mail className="w-4 h-4 mr-2" /> Message groupé
            </Button>
          </div>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 bg-white/5 border-white/10 h-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="border-white/10 text-white h-10">
                <Filter className="w-4 h-4 mr-2" /> Filtrer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-white text-xs uppercase font-bold">Élève</TableHead>
                      <TableHead className="text-white text-xs uppercase font-bold">Identifiant</TableHead>
                      <TableHead className="text-white text-xs uppercase font-bold">Classe</TableHead>
                      <TableHead className="text-white text-xs uppercase font-bold">Scolarité</TableHead>
                      <TableHead className="text-right text-white text-xs uppercase font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedStudents.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-white/5 border-white/5 group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              {(s.firstName?.[0] || "?")}{(s.lastName?.[0] || "?")}
                            </div>
                            <span className="font-medium text-white text-sm">
                              {s.lastName ? s.lastName.toUpperCase() : ""} {s.firstName || ""}
                              {!s.lastName && !s.firstName && <span className="text-muted-foreground italic text-xs">Compte non activé</span>}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="text-white text-sm">{s.gradeLevel}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-bold px-2 py-0.5",
                            s.paymentStatus === "Payé" ? "bg-accent/20 text-accent border-accent/20" : 
                            "bg-destructive/20 text-destructive border-destructive/20"
                          )} variant="outline">
                            {s.paymentStatus || "Impayé"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAndSortedStudents.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                          Aucun élève trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}