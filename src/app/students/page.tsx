
"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, UserPlus, Sparkles, CheckCircle, Loader2, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { provisionUserAccount, DirectorAccountProvisioningOutput } from "@/ai/flows/director-account-provisioning-assistant";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, setDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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

  const downloadStudentPDF = (id: string, firstName: string, lastName: string, grade: string) => {
    const doc = new jsPDF();
    doc.setFillColor(20, 83, 45); 
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("ACADEX - FICHE D'ACCES ELEVE", 105, 20, { align: "center" });
    doc.setTextColor(15, 23, 42); 
    doc.setFontSize(12);
    doc.text(`Élève : ${lastName.toUpperCase()} ${firstName}`, 20, 50);
    doc.text(`Classe : ${grade}`, 20, 60);
    doc.rect(20, 75, 170, 30);
    doc.text("VOTRE IDENTIFIANT PERSONNEL :", 105, 85, { align: "center" });
    doc.setFontSize(20);
    doc.text(id, 105, 95, { align: "center" });
    doc.save(`ACADEX_ACCES_${id}.pdf`);
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
    
    // Spontané : pas de await
    setDoc(studentRef, studentData).catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    
    toast({ title: "Accès provisionné", description: `L'ID ${studentId} est prêt.` });
    setAiResult(null);
    setFormData({ firstName: "", lastName: "", gradeLevel: "" });
  }, [db, aiResult, formData, toast]);

  const joyBackground = PlaceHolderImages.find(img => img.id === "login-bg");

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 animate-fade-up">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter uppercase leading-none">Registre Élèves</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-widest">Effectifs ACADEX 2026-2027</p>
          </div>
          <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-12 px-6 rounded-xl shadow-xl transition-all flex gap-3 text-[10px] md:text-sm uppercase tracking-tighter border-2 border-white/10 shrink-0">
                <UserPlus className="w-4 h-4" /> Nouvel Élève
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden shadow-2xl sm:max-w-[400px] rounded-[2rem]">
              <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-md shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <DialogTitle className="text-lg font-black tracking-tighter uppercase">Provisionnement</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="p-6 space-y-4">
                {!aiResult ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[8px] font-black text-[#0F172A] uppercase tracking-widest">Prénom</Label>
                        <Input className="h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] font-black text-[#0F172A] uppercase tracking-widest">Nom</Label>
                        <Input className="h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black text-[#0F172A] uppercase tracking-widest">Classe</Label>
                      <Input placeholder="3EME A" className="h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs" value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value.toUpperCase()})} />
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-primary text-white space-y-3 text-center shadow-inner">
                    <p className="text-[8px] font-black uppercase text-accent tracking-widest">ID Suggéré</p>
                    <div className="bg-white p-3 rounded-lg"><span className="text-xl font-black text-primary">{aiResult.suggestedId}</span></div>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 pt-0 flex flex-col gap-2">
                {!aiResult ? (
                  <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-12 rounded-xl text-xs uppercase" onClick={handleAiProvision} disabled={isAiLoading}>
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer avec IA"}
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => downloadStudentPDF(aiResult.suggestedId, formData.firstName, formData.lastName, formData.gradeLevel)} variant="outline" className="h-10 text-[9px] uppercase font-black border-2"><FileDown className="w-3.5 h-3.5 mr-2" /> Télécharger</Button>
                    <Button className="bg-accent text-white h-12 rounded-xl text-xs uppercase font-black" onClick={saveStudent}>Valider l'Inscription</Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="vivid-box border-none shadow-xl overflow-hidden bg-white/95 p-0 rounded-[2rem]">
          <CardHeader className="p-4 md:p-6 border-b-2 border-slate-50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <Input placeholder="Rechercher..." className="pl-10 h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-10">
                      <TableHead className="text-white font-black pl-6 text-[8px] uppercase tracking-widest">Élève</TableHead>
                      <TableHead className="text-white font-black text-[8px] uppercase tracking-widest">Classe</TableHead>
                      <TableHead className="text-right pr-6 text-white font-black text-[8px] uppercase tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-primary/5 transition-all border-slate-50">
                        <TableCell className="pl-6 py-3">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shrink-0">
                                {s.lastName?.[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-[#0F172A] text-[11px] md:text-sm uppercase truncate">{s.lastName} {s.firstName}</p>
                                <p className="text-[7px] font-mono text-primary opacity-60 uppercase">{s.id}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-3 font-black text-[#0F172A] text-xs">{s.gradeLevel}</TableCell>
                        <TableCell className="text-right pr-6 py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary hover:text-white rounded-lg" onClick={() => downloadStudentPDF(s.id, s.firstName || "", s.lastName || "", s.gradeLevel)}>
                            <FileDown className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
