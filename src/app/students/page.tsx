
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
    gradeLevel: "",
    id: ""
  });

  // Génération d'identifiant spontanée
  useEffect(() => {
    if (formData.firstName && formData.lastName && formData.gradeLevel) {
      const classCode = formData.gradeLevel.replace(/\s+/g, '').substring(0, 3).toUpperCase() || "GEN";
      const randomNum = Math.floor(Math.random() * 900) + 100;
      const generatedId = `ELV-${classCode}-${randomNum}`;
      setFormData(prev => ({ ...prev, id: generatedId }));
    }
  }, [formData.firstName, formData.lastName, formData.gradeLevel]);

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
    if (!formData.firstName || !formData.lastName || !formData.gradeLevel) return;
    setIsAiLoading(true);
    try {
      const result = await provisionUserAccount({
        userType: 'ELEVE',
        firstName: formData.firstName,
        lastName: formData.lastName,
        gradeLevel: formData.gradeLevel
      });
      setAiResult(result);
      if (result.suggestedId) setFormData(prev => ({ ...prev, id: result.suggestedId }));
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur IA", description: "Impossible d'affiner le message." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadStudentPDF = (id: string, firstName: string, lastName: string, grade: string) => {
    const doc = new jsPDF();
    doc.setFillColor(20, 83, 45); 
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("ACADEX - FICHE D'ACCES ELEVE", 105, 17, { align: "center" });
    doc.setTextColor(15, 23, 42); 
    doc.setFontSize(11);
    doc.text(`Élève : ${lastName.toUpperCase()} ${firstName}`, 20, 45);
    doc.text(`Classe : ${grade}`, 20, 55);
    doc.rect(20, 70, 170, 25);
    doc.text("VOTRE IDENTIFIANT PERSONNEL :", 105, 80, { align: "center" });
    doc.setFontSize(18);
    doc.text(id, 105, 90, { align: "center" });
    doc.save(`ACADEX_ACCES_${id}.pdf`);
  };

  const saveStudent = useCallback(() => {
    if (!db || !formData.id) return;
    const studentId = formData.id;
    const studentRef = doc(db, "students", studentId);
    const studentData = {
      id: studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gradeLevel: formData.gradeLevel,
      status: "En attente",
      createdAt: serverTimestamp()
    };
    
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
    setFormData({ firstName: "", lastName: "", gradeLevel: "", id: "" });
  }, [db, formData, toast]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-up">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter uppercase leading-none">Registre Élèves</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-widest">Effectifs ACADEX 2026-2027</p>
          </div>
          <Dialog onOpenChange={(open) => !open && (setAiResult(null), setFormData({ firstName: "", lastName: "", gradeLevel: "", id: "" }))}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-12 px-5 md:px-6 rounded-xl shadow-xl transition-all flex gap-2 text-[10px] md:text-sm uppercase tracking-tighter border-2 border-white/10 shrink-0">
                <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" /> Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden shadow-2xl sm:max-w-[400px] rounded-[2rem]">
              <DialogHeader className="p-5 bg-primary text-white border-b-2 border-accent">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-md shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <DialogTitle className="text-base font-black tracking-tighter uppercase">Inscription Élite</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="p-6 space-y-4">
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

                {formData.id && (
                  <div className="p-4 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20 space-y-1.5 text-center">
                    <p className="text-[7px] font-black uppercase text-primary tracking-[0.3em]">Identifiant Spontané</p>
                    <p className="text-xl font-black text-primary font-mono tracking-tighter">{formData.id}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 pt-0 flex flex-col gap-2">
                <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-11 rounded-xl text-xs uppercase" onClick={saveStudent} disabled={!formData.id}>
                  Valider Inscription
                </Button>
                <Button variant="ghost" className="text-[8px] uppercase font-black text-slate-400 hover:text-primary h-8" onClick={handleAiProvision} disabled={isAiLoading || !formData.id}>
                   {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />} Affiner avec l'IA
                </Button>
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
              <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
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
                              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-black text-[10px] shrink-0">
                                {s.lastName?.[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-[#0F172A] text-[10px] md:text-sm uppercase truncate">{s.lastName} {s.firstName}</p>
                                <p className="text-[6px] font-mono text-primary opacity-60 uppercase">{s.id}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-3 font-black text-[#0F172A] text-xs">{s.gradeLevel}</TableCell>
                        <TableCell className="text-right pr-6 py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary hover:text-white rounded-lg" onClick={() => downloadStudentPDF(s.id, s.firstName || "", s.lastName || "", s.gradeLevel)}>
                            <FileDown className="w-3.5 h-3.5" />
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
