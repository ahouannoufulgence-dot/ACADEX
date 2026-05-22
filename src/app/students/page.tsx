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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h1 className="text-5xl md:text-8xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Registre Élèves</h1>
            <p className="text-[#0F172A] text-2xl font-black">Gestion des effectifs et provisionnement intelligent ACADEX.</p>
          </div>
          <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-20 px-14 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex gap-6 text-xl border-4 border-white/10">
                <UserPlus className="w-8 h-8" /> Nouvel Élève
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none sm:max-w-[600px] bg-white p-0 overflow-hidden shadow-[0_60px_180px_rgba(0,0,0,0.4)]">
              <DialogHeader className="p-12 bg-primary text-white border-b-8 border-accent">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-2xl rotate-6">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <DialogTitle className="text-4xl font-black tracking-tighter">Provisionnement IA</DialogTitle>
                </div>
                <DialogDescription className="text-white font-black text-xl mt-4 opacity-80">Générez un identifiant conforme aux standards Élite.</DialogDescription>
              </DialogHeader>
              
              <div className="p-12 space-y-10 bg-white">
                {!aiResult ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Prénom</Label>
                        <Input 
                          className="bg-[#F1F5F9] border-4 border-slate-50 h-16 rounded-2xl font-black text-xl text-[#0F172A] px-6 shadow-inner" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Nom</Label>
                        <Input 
                          className="bg-[#F1F5F9] border-4 border-slate-50 h-16 rounded-2xl font-black text-xl text-[#0F172A] px-6 shadow-inner" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Classe / Niveau</Label>
                      <Input 
                        placeholder="Ex: 3EME A" 
                        className="bg-[#F1F5F9] border-4 border-slate-50 h-16 rounded-2xl font-black text-xl text-[#0F172A] px-6 shadow-inner" 
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value.toUpperCase()})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-10 rounded-[3rem] bg-primary text-white border-8 border-white/20 space-y-6 animate-in zoom-in duration-500 shadow-2xl">
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-center text-accent">ID Élite Suggéré</p>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                       <span className="text-5xl font-headline font-black text-primary tracking-tighter">{aiResult.suggestedId}</span>
                    </div>
                    <p className="text-lg font-black text-center leading-tight px-6 opacity-90 italic">"{aiResult.draftWelcomeMessage.substring(0, 80)}..."</p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-12 pt-0 bg-white">
                {!aiResult ? (
                  <Button 
                    className="bg-primary hover:bg-slate-900 text-white font-black w-full h-24 rounded-[2.5rem] shadow-2xl text-2xl border-4 border-white/10" 
                    onClick={handleAiProvision}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? <Loader2 className="w-10 h-10 animate-spin" /> : "Générer avec ACADEX AI"}
                  </Button>
                ) : (
                  <Button className="bg-accent text-white hover:bg-slate-900 font-black w-full h-24 rounded-[2.5rem] shadow-2xl text-2xl border-4 border-white/10" onClick={saveStudent}>
                    <CheckCircle className="w-10 h-10 mr-4" /> Inscrire l'Élève
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-12 md:p-14 border-b-4 border-slate-50">
            <div className="relative w-full max-w-3xl group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-[#0F172A] transition-all" />
              <Input 
                placeholder="Rechercher par nom, ID ou classe..." 
                className="pl-24 h-24 bg-[#F1F5F9] border-4 border-slate-50 rounded-[2.5rem] focus-visible:ring-8 focus-visible:ring-primary/10 font-black text-2xl text-[#0F172A] shadow-inner" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-56">
                <Loader2 className="w-24 h-24 animate-spin text-primary mb-8" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.4em] text-xl">Accès au registre sécurisé...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-24">
                      <TableHead className="text-white font-black pl-20 text-xs uppercase tracking-[0.3em]">Élève</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Code Accès</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Classe</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Statut</TableHead>
                      <TableHead className="text-right pr-20 text-white font-black text-xs uppercase tracking-[0.3em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-primary/5 transition-all border-slate-100">
                        <TableCell className="pl-20 py-12">
                           <div className="flex items-center gap-10">
                              <div className="w-20 h-20 rounded-[2rem] bg-primary text-white flex items-center justify-center font-black text-3xl shadow-2xl border-4 border-white/20">
                                {(s.lastName?.[0] || "?").toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <p className="font-black text-[#0F172A] text-3xl tracking-tighter uppercase">{(s.lastName || "En attente").toUpperCase()} {s.firstName || ""}</p>
                                <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-2">Dossier Académique Actif</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-12">
                           <Badge variant="outline" className="font-mono text-base font-black text-primary border-2 border-primary/20 bg-white px-6 h-10 rounded-[1rem] shadow-lg">{s.id}</Badge>
                        </TableCell>
                        <TableCell className="py-12 font-black text-[#0F172A] text-2xl tracking-tighter">{s.gradeLevel}</TableCell>
                        <TableCell className="py-12">
                          <Badge className={cn(
                            "text-[12px] font-black px-6 py-2.5 h-12 uppercase tracking-[0.2em] border-none shadow-2xl",
                            s.status === "Actif" ? "bg-accent text-white" : "bg-primary text-white"
                          )} variant="outline">
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-20 py-12">
                          <Button variant="ghost" size="icon" className="h-16 w-16 text-[#0F172A] hover:bg-primary/10 transition-colors">
                            <MoreVertical className="w-10 h-10" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-64">
                           <p className="text-4xl font-black uppercase text-[#0F172A] tracking-[0.4em] opacity-30">Aucun élève trouvé</p>
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