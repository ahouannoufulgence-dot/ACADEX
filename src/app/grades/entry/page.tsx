
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Save, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function GradesEntryPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load students for the selected class
  const studentsQuery = useMemo(() => {
    if (!db || !selectedClass) return null;
    return query(collection(db, "students"), where("gradeLevel", "==", selectedClass));
  }, [db, selectedClass]);

  const { data: students, loading: loadingStudents } = useCollection(studentsQuery);

  // Load existing grades
  const existingGradesQuery = useMemo(() => {
    if (!db || !selectedClass || !selectedSubject || !selectedType) return null;
    return query(
      collection(db, "grades"), 
      where("subjectName", "==", selectedSubject),
      where("type", "==", selectedType),
      where("term", "==", "Trimestre 1")
    );
  }, [db, selectedClass, selectedSubject, selectedType]);

  const { data: existingGrades } = useCollection(existingGradesQuery);

  const isConfirmed = useMemo(() => {
    return existingGrades?.some(g => g.status === "Confirmé");
  }, [existingGrades]);

  useEffect(() => {
    if (existingGrades) {
      const newGrades: Record<string, string> = {};
      existingGrades.forEach(g => {
        newGrades[g.studentId] = g.value.toString();
      });
      setGrades(newGrades);
    } else {
      setGrades({});
    }
  }, [existingGrades]);

  const handleGradeChange = (studentId: string, value: string) => {
    if (isConfirmed) return;
    setGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const saveGrades = (status: "Brouillon" | "Confirmé") => {
    if (!db || !selectedSubject || !selectedType) {
      toast({ variant: "destructive", title: "Configuration manquante", description: "Veuillez choisir une matière et un type." });
      return;
    }
    setIsSaving(true);

    const userStr = localStorage.getItem("acadex_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Enseignant Inconnu" };

    students?.forEach(student => {
      const gradeValue = grades[student.id];
      if (gradeValue === undefined || gradeValue === "") return;

      const gradeId = `${student.id}-${selectedSubject}-${selectedType}`.replace(/\s+/g, '-');
      const gradeRef = doc(db, "grades", gradeId);
      
      const gradeData = {
        studentId: student.id,
        studentName: `${student.lastName || ''} ${student.firstName || ''}`.trim() || student.id,
        subjectName: selectedSubject,
        type: selectedType,
        value: Number(gradeValue),
        status: status,
        term: "Trimestre 1",
        updatedBy: user.name,
        date: serverTimestamp()
      };

      setDoc(gradeRef, gradeData, { merge: true })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: gradeRef.path,
            operation: 'write',
            requestResourceData: gradeData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    });

    toast({
      title: status === "Confirmé" ? "Notes publiées !" : "Brouillon enregistré",
      description: status === "Confirmé" ? "Les notes sont maintenant verrouillées." : "Modifications sauvegardées avec succès.",
    });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-up">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase">Saisie des Notes <span className="text-primary">(T1)</span></h1>
            <p className="text-[#0F172A] text-lg md:text-xl font-black opacity-60 uppercase tracking-widest italic">Registre numérique • Session 2026-2027</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {!isConfirmed && (
              <>
                <Button variant="outline" className="border-slate-200 h-14 md:h-16 px-8 rounded-2xl font-black text-[#0F172A] shadow-lg bg-white hover:bg-slate-50 uppercase text-[10px] md:text-sm tracking-widest" onClick={() => saveGrades("Brouillon")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />} Brouillon
                </Button>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-14 md:h-16 px-8 rounded-2xl shadow-2xl transition-all active:scale-95 border-4 border-white/10 uppercase text-[10px] md:text-sm tracking-widest" onClick={() => saveGrades("Confirmé")} disabled={isSaving}>
                  <CheckCircle2 className="w-5 h-5 mr-3" /> Publier T1
                </Button>
              </>
            )}
            {isConfirmed && (
              <Badge className="bg-primary text-white h-14 md:h-16 px-8 rounded-2xl font-black flex gap-3 text-sm md:text-lg shadow-2xl border-none uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6" /> Évaluation Verrouillée
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 md:gap-12">
          <Card className="xl:col-span-1 vivid-box border-none shadow-2xl h-fit rounded-[2rem]">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-[#0F172A] flex items-center gap-3 text-xl md:text-2xl font-black tracking-tighter uppercase">
                <Sparkles className="w-5 h-5 text-primary" /> Config
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-slate-50 border-4 border-slate-100 h-14 rounded-xl focus:ring-primary/20 text-base font-black text-[#0F172A]">
                    <SelectValue placeholder="Sél." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6EME D">6ème D</SelectItem>
                    <SelectItem value="3EME A">3ème A</SelectItem>
                    <SelectItem value="TLE D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-slate-50 border-4 border-slate-100 h-14 rounded-xl text-base font-black text-[#0F172A]">
                    <SelectValue placeholder="Sél." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="SVT">SVT</SelectItem>
                    <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-slate-50 border-4 border-slate-100 h-14 rounded-xl text-base font-black text-[#0F172A]">
                    <SelectValue placeholder="Sél." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interrogation 1">Interrogation 1</SelectItem>
                    <SelectItem value="Interrogation 2">Interrogation 2</SelectItem>
                    <SelectItem value="Devoir Surveillé 1">Devoir Surveillé 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-3 vivid-box border-none shadow-2xl overflow-hidden bg-white/95 rounded-[2.5rem]">
            <CardHeader className="p-8 md:p-10 pb-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter uppercase">Registre de Saisie</CardTitle>
                  <CardDescription className="text-sm md:text-lg font-black mt-1 text-primary uppercase tracking-widest opacity-60">
                    {selectedClass && selectedSubject ? `${selectedClass} • ${selectedSubject}` : "Veuillez configurer l'évaluation."}
                  </CardDescription>
                </div>
                {isConfirmed && <Badge variant="outline" className="border-primary text-primary font-black h-7 px-4 text-[9px] uppercase tracking-widest bg-primary/5">Lecture Seule</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-200">
                  <AlertCircle className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-xl font-black uppercase tracking-[0.3em]">En attente de classe</p>
                </div>
              ) : loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-32">
                   <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Chargement...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-900">
                      <TableRow className="border-none h-12 md:h-16">
                        <TableHead className="text-white font-black h-12 md:h-16 pl-8 md:pl-10 text-[9px] md:text-xs uppercase tracking-widest">Élève</TableHead>
                        <TableHead className="text-white font-black text-center text-[9px] md:text-xs uppercase tracking-widest">Note / 20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students?.map((s) => (
                        <TableRow key={s.id} className="hover:bg-primary/5 transition-all border-slate-50">
                          <TableCell className="pl-8 md:pl-10 py-4 md:py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm md:text-lg shadow-md border border-white/10">
                                  {(s.lastName?.[0] || "?").toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-[#0F172A] text-sm md:text-xl tracking-tighter uppercase truncate">{(s.lastName || "").toUpperCase()} {s.firstName || ""}</p>
                                  <p className="text-[8px] md:text-[10px] text-primary font-black font-mono tracking-tighter uppercase mt-0.5 opacity-60">{s.id}</p>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-4 md:py-6 pr-8 md:pr-10">
                            <Input 
                              type="number" 
                              max="20" 
                              min="0"
                              step="0.25"
                              placeholder="00.0" 
                              className={cn(
                                "h-14 md:h-18 text-center text-2xl md:text-4xl font-black rounded-xl border-4 transition-all focus:ring-8 focus:ring-primary/5",
                                isConfirmed 
                                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-100 text-primary focus:border-primary shadow-xl"
                              )}
                              value={grades[s.id] || ""}
                              onChange={(e) => handleGradeChange(s.id, e.target.value)}
                              disabled={isConfirmed}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {(students?.length === 0 || !students) && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-32 text-slate-300 italic font-black uppercase text-lg tracking-widest">
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
      </div>
    </DashboardLayout>
  );
}
