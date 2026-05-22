
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, MoreVertical, UserPlus, Sparkles, Copy, CheckCircle, Loader2 } from "lucide-react";
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
import { collection, setDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
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
    return query(collection(db, "students"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: students, loading } = useCollection(studentsQuery);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter((s: any) => 
      s.firstName?.toLowerCase().includes(q) || 
      s.lastName?.toLowerCase().includes(q) || 
      s.id?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const handleAiProvision = async () => {
    if (!formData.firstName || !formData.lastName || !formData.gradeLevel) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations."
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
        description: "Impossible de générer les informations."
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
      status: "En attente",
      createdAt: serverTimestamp()
    };

    setDoc(studentRef, studentData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({
      title: "Accès provisionné",
      description: `L'ID ${studentId} a été ajouté au registre.`,
    });
    setAiResult(null);
    setFormData({ firstName: "", lastName: "", gradeLevel: "" });
  }, [db, aiResult, formData, toast]);

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter">Registre des Élèves</h1>
            <p className="text-slate-500 text-xl font-bold">Gestion des effectifs et provisionnement intelligent.</p>
          </div>
          <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-2xl shadow-2xl transition-all active:scale-95 flex gap-4">
                <UserPlus className="w-6 h-6" /> Nouvel Élève
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none sm:max-w-[500px] bg-white p-0 overflow-hidden">
              <DialogHeader className="p-10 bg-slate-50/50 border-b border-slate-100">
                <DialogTitle className="flex items-center gap-4 text-3xl font-black text-[#0F172A] tracking-tighter">
                  <div className="p-3 bg-primary rounded-2xl shadow-lg rotate-3">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  Provisionnement IA
                </DialogTitle>
                <DialogDescription className="text-lg font-bold mt-2">Générez un identifiant conforme aux standards ACADEX.</DialogDescription>
              </DialogHeader>
              
              <div className="p-10 space-y-8">
                {!aiResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</Label>
                        <Input 
                          className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-bold" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</Label>
                        <Input 
                          className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-bold" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe / Niveau</Label>
                      <Input 
                        placeholder="Ex: 3EME A" 
                        className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-bold" 
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value.toUpperCase()})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-[2rem] bg-primary/5 border-4 border-primary/5 space-y-4 animate-in zoom-in duration-300">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] text-center">Identifiant Suggéré</p>
                    <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
                       <span className="text-4xl font-headline font-black text-primary tracking-tighter">{aiResult.suggestedId}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold text-center leading-relaxed px-4">{aiResult.draftWelcomeMessage.substring(0, 100)}...</p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-10 pt-0">
                {!aiResult ? (
                  <Button 
                    className="bg-primary text-white font-black w-full h-20 rounded-[2rem] shadow-2xl" 
                    onClick={handleAiProvision}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Générer avec ACADEX AI"}
                  </Button>
                ) : (
                  <Button className="bg-accent text-white font-black w-full h-20 rounded-[2rem] shadow-2xl" onClick={saveStudent}>
                    <CheckCircle className="w-8 h-8 mr-3" /> Confirmer l'Inscription
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-12 pb-6 border-b border-slate-100">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all" />
              <Input 
                placeholder="Rechercher par nom, ID ou classe..." 
                className="pl-16 h-16 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus-visible:ring-4 focus-visible:ring-primary/5 font-bold text-lg" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Chargement du registre...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100 h-20">
                      <TableHead className="text-[#0F172A] font-black pl-12 text-xs uppercase tracking-[0.25em]">Élève</TableHead>
                      <TableHead className="text-[#0F172A] font-black text-xs uppercase tracking-[0.25em]">Identifiant</TableHead>
                      <TableHead className="text-[#0F172A] font-black text-xs uppercase tracking-[0.25em]">Classe</TableHead>
                      <TableHead className="text-[#0F172A] font-black text-xs uppercase tracking-[0.25em]">Statut</TableHead>
                      <TableHead className="text-right pr-12 text-[#0F172A] font-black text-xs uppercase tracking-[0.25em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-slate-50 transition-all border-slate-100">
                        <TableCell className="pl-12 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner border-2 border-primary/5">
                                {(s.lastName?.[0] || "?").toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-[#0F172A] text-xl tracking-tight">{(s.lastName || "En attente").toUpperCase()} {s.firstName || ""}</p>
                                <p className="text-xs text-slate-400 font-black uppercase tracking-tighter mt-1">Sexe non défini</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-8">
                           <Badge variant="outline" className="font-mono text-xs font-black text-primary border-primary/20 bg-white px-4 h-8 rounded-xl">{s.id}</Badge>
                        </TableCell>
                        <TableCell className="py-8 font-black text-[#0F172A]">{s.gradeLevel}</TableCell>
                        <TableCell className="py-8">
                          <Badge className={cn(
                            "text-[10px] font-black px-4 py-1.5 h-8 uppercase tracking-[0.15em] border-none shadow-sm",
                            s.status === "Actif" ? "bg-accent text-white" : "bg-amber-400/20 text-amber-600"
                          )} variant="outline">
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-12 py-8">
                          <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-300 hover:text-primary transition-colors">
                            <MoreVertical className="w-6 h-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-40 text-slate-300">
                           <p className="text-2xl font-black uppercase tracking-[0.2em] opacity-30">Aucun élève trouvé</p>
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
