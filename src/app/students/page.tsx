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
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("ACADEX - FICHE D'ACCES ELEVE", 105, 25, { align: "center" });
    doc.setTextColor(15, 23, 42); 
    doc.setFontSize(14);
    doc.text(`Élève : ${lastName.toUpperCase()} ${firstName}`, 20, 60);
    doc.text(`Classe : ${grade}`, 20, 70);
    doc.rect(20, 85, 170, 40);
    doc.setFontSize(12);
    doc.text("VOTRE IDENTIFIANT PERSONNEL :", 105, 100, { align: "center" });
    doc.setFontSize(24);
    doc.text(id, 105, 115, { align: "center" });
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
    setDoc(studentRef, studentData).catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    toast({ title: "Accès provisionné", description: `L'ID ${studentId} a été ajouté.` });
    setAiResult(null);
    setFormData({ firstName: "", lastName: "", gradeLevel: "" });
  }, [db, aiResult, formData, toast]);

  const joyBackground = PlaceHolderImages.find(img => img.id === "login-bg");

  return (
    <DashboardLayout>
      <div className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-screen overflow-x-hidden">
        <Image 
          src={joyBackground?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"} 
          alt="Fond Joie et Concentration" 
          fill 
          className="object-cover opacity-90 saturate-[1.8] blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-white/50" />
        
        <div className="relative z-10 space-y-6 md:space-y-10 animate-fade-up">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] tracking-tighter">Registre Élèves</h1>
              <p className="text-[#0F172A] text-lg md:text-xl font-black opacity-80">Gestion des effectifs ACADEX.</p>
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 md:px-10 rounded-2xl shadow-xl transition-all w-full md:w-auto flex gap-4 text-sm md:text-lg border-2 border-white/10">
                    <UserPlus className="w-5 h-5 md:w-6 md:h-6" /> Nouvel Élève
                  </Button>
                </DialogTrigger>
                <DialogContent className="vivid-box border-none sm:max-w-[500px] bg-white p-0 overflow-hidden shadow-2xl">
                  <DialogHeader className="p-8 bg-primary text-white border-b-4 border-accent">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-lg">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <DialogTitle className="text-2xl font-black tracking-tighter">Provisionnement IA</DialogTitle>
                    </div>
                  </DialogHeader>
                  
                  <div className="p-8 space-y-6 bg-white">
                    {!aiResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Prénom</Label>
                            <Input 
                              className="bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-[#0F172A]" 
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Nom</Label>
                            <Input 
                              className="bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-[#0F172A]" 
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Classe / Niveau</Label>
                          <Input 
                            placeholder="Ex: 3EME A" 
                            className="bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-[#0F172A]" 
                            value={formData.gradeLevel}
                            onChange={(e) => setFormData({...formData, gradeLevel: e.target.value.toUpperCase()})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in zoom-in duration-500">
                        <div className="p-6 rounded-2xl bg-primary text-white border-4 border-white/20 space-y-4 shadow-lg text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">ID Suggéré</p>
                          <div className="bg-white p-4 rounded-xl shadow-inner">
                            <span className="text-3xl font-headline font-black text-primary tracking-tighter">{aiResult.suggestedId}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="p-8 pt-0">
                    {!aiResult ? (
                      <Button 
                        className="bg-primary hover:bg-slate-900 text-white font-black w-full h-16 rounded-2xl shadow-lg text-lg border-2 border-white/10" 
                        onClick={handleAiProvision}
                        disabled={isAiLoading}
                      >
                        {isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Générer avec ACADEX AI"}
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-4 w-full">
                        <Button 
                          onClick={() => downloadStudentPDF(aiResult.suggestedId, formData.firstName, formData.lastName, formData.gradeLevel)}
                          variant="outline" 
                          className="w-full h-12 rounded-xl border-2 border-slate-100 text-[#0F172A] font-black flex gap-2 text-sm"
                        >
                          <FileDown className="w-5 h-5" /> Télécharger Fiche
                        </Button>
                        <Button className="bg-accent text-white hover:bg-slate-900 font-black w-full h-16 rounded-2xl shadow-lg text-lg border-2 border-white/10" onClick={saveStudent}>
                          <CheckCircle className="w-6 h-6 mr-2" /> Inscrire l'Élève
                        </Button>
                      </div>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="vivid-box border-none shadow-xl overflow-hidden bg-white/95 p-0">
            <CardHeader className="p-6 md:p-8 border-b-2 border-slate-50">
              <div className="relative w-full max-w-xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A] opacity-30" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-14 h-14 bg-white border-2 border-slate-100 rounded-xl focus-visible:ring-4 focus-visible:ring-primary/10 font-black text-[#0F172A] shadow-md" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-[#0F172A] font-black uppercase tracking-[0.2em] text-xs">Accès au registre...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-900">
                      <TableRow className="border-none h-16">
                        <TableHead className="text-white font-black pl-8 text-[10px] uppercase tracking-widest">Élève</TableHead>
                        <TableHead className="text-white font-black text-[10px] uppercase tracking-widest">Identifiant</TableHead>
                        <TableHead className="text-white font-black text-[10px] uppercase tracking-widest">Classe</TableHead>
                        <TableHead className="text-right pr-8 text-white font-black text-[10px] uppercase tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s: any) => (
                        <TableRow key={s.id} className="hover:bg-primary/5 transition-all border-slate-50">
                          <TableCell className="pl-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-md">
                                  {(s.lastName?.[0] || "?").toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-black text-[#0F172A] text-sm md:text-lg tracking-tight uppercase">{(s.lastName || "").toUpperCase()} {s.firstName || ""}</p>
                                  <Badge className="bg-slate-100 text-slate-500 text-[8px] font-black border-none px-2 h-4">{s.status}</Badge>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-6">
                             <span className="font-mono text-xs font-black text-primary bg-slate-50 px-3 py-1 rounded-md">{s.id}</span>
                          </TableCell>
                          <TableCell className="py-6 font-black text-[#0F172A] text-sm md:text-lg">{s.gradeLevel}</TableCell>
                          <TableCell className="text-right pr-8 py-6">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-primary hover:bg-primary hover:text-white transition-all rounded-xl"
                              onClick={() => downloadStudentPDF(s.id, s.firstName || "", s.lastName || "", s.gradeLevel)}
                            >
                              <FileDown className="w-5 h-5" />
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
      </div>
    </DashboardLayout>
  );
}