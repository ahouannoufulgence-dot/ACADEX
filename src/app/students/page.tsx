
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, MoreVertical, UserPlus, Sparkles, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];
    
    let result = [...students];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => {
        const fname = (s.firstName || "").toLowerCase();
        const lname = (s.lastName || "").toLowerCase();
        const sid = (s.id || "").toLowerCase();
        return fname.includes(q) || lname.includes(q) || sid.includes(q);
      });
    }

    return result.sort((a: any, b: any) => {
      const nameA = `${a.lastName || ""} ${a.firstName || ""}`.toLowerCase().trim();
      const nameB = `${b.lastName || ""} ${b.firstName || ""}`.toLowerCase().trim();
      
      if (!nameA && !nameB) return a.id.localeCompare(b.id);
      if (!nameA) return 1;
      if (!nameB) return -1;
      
      return nameA.localeCompare(nameB, 'fr');
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
      description: `${formData.firstName} ${formData.lastName} a été ajouté.`
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
            <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-1">Gestion des Élèves</h1>
            <p className="text-slate-500 text-sm">Effectif actuel: {students?.length || 0} enregistrés.</p>
          </div>
          <div className="flex gap-2">
             <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
              <DialogTrigger asChild>
                <Button className="bg-[#1A6B4A] hover:bg-[#1A6B4A]/90 text-white font-bold h-10 px-6">
                  <UserPlus className="w-4 h-4 mr-2" /> Nouvel Élève
                </Button>
              </DialogTrigger>
              <DialogContent className="premium-card border-none sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[#1F2937]">
                    <Sparkles className="w-5 h-5 text-[#1A6B4A]" />
                    Provisionnement IA
                  </DialogTitle>
                  <DialogDescription>
                    Générez automatiquement un compte élève optimisé selon les standards ACADEX.
                  </DialogDescription>
                </DialogHeader>
                
                {!aiResult ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fname" className="text-slate-500 font-bold text-[10px] uppercase">Prénom</Label>
                        <Input 
                          id="fname" 
                          className="bg-slate-50 border-slate-100 h-11" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname" className="text-slate-500 font-bold text-[10px] uppercase">Nom</Label>
                        <Input 
                          id="lname" 
                          className="bg-slate-50 border-slate-100 h-11" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class" className="text-slate-500 font-bold text-[10px] uppercase">Classe / Niveau</Label>
                      <Input 
                        id="class" 
                        placeholder="Ex: 3ème D" 
                        className="bg-slate-50 border-slate-100 h-11" 
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 rounded-xl bg-[#1A6B4A]/5 border border-[#1A6B4A]/10">
                      <p className="text-[10px] font-bold text-[#1A6B4A] uppercase mb-1">Identifiant Suggéré</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-bold text-[#1F2937] tracking-wider">{aiResult.suggestedId}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1A6B4A]" onClick={() => copyToClipboard(aiResult.suggestedId)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {!aiResult ? (
                    <Button 
                      className="bg-[#1A6B4A] text-white font-bold w-full h-11" 
                      onClick={handleAiProvision}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? "Génération..." : "Générer avec ACADEX AI"}
                    </Button>
                  ) : (
                    <Button className="bg-[#1A6B4A] text-white font-bold w-full h-11" onClick={saveStudent}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Confirmer l'enregistrement
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="premium-card">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  placeholder="Rechercher par nom ou identifiant..." 
                  className="pl-10 bg-slate-50 border-none h-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="w-6 h-6 border-2 border-[#1A6B4A] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100">
                      <TableHead className="text-[#1F2937] text-xs uppercase font-bold">Élève</TableHead>
                      <TableHead className="text-[#1F2937] text-xs uppercase font-bold">Identifiant</TableHead>
                      <TableHead className="text-[#1F2937] text-xs uppercase font-bold">Classe</TableHead>
                      <TableHead className="text-[#1F2937] text-xs uppercase font-bold">Statut</TableHead>
                      <TableHead className="text-right text-[#1F2937] text-xs uppercase font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedStudents.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 border-slate-50 group transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A6B4A]/10 flex items-center justify-center text-[#1A6B4A] font-bold text-xs shrink-0">
                              {(s.lastName?.[0] || s.id?.[4] || "?").toUpperCase()}
                            </div>
                            <span className="font-semibold text-[#1F2937] text-sm">
                              {s.lastName ? `${s.lastName.toUpperCase()} ${s.firstName || ""}` : (
                                <span className="text-slate-400 italic text-xs">Accès généré</span>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-[#1A6B4A] font-bold">{s.id}</TableCell>
                        <TableCell className="text-slate-600 text-sm font-medium">{s.gradeLevel}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-bold px-2 py-0.5 border-none",
                            s.status === "Actif" ? "bg-[#1A6B4A]/10 text-[#1A6B4A]" : "bg-amber-400/10 text-amber-500"
                          )} variant="outline">
                            {s.status === "Actif" ? "Activé" : "En attente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-[#1A6B4A]">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAndSortedStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
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
