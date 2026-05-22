
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

  // Load existing grades if any to populate the table
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
            <h1 className="text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter">Saisie des Notes <span className="text-primary">(T1)</span></h1>
            <p className="text-slate-500 text-xl font-bold">Registre numérique sécurisé • Session 2023-2024</p>
          </div>
          <div className="flex flex-wrap gap-5">
            {!isConfirmed && (
              <>
                <Button variant="outline" className="border-slate-200 h-16 px-10 rounded-[1.5rem] font-black text-[#0F172A] shadow-lg bg-white hover:bg-slate-50" onClick={() => saveGrades("Brouillon")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />} Brouillon
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 shadow-primary/30" onClick={() => saveGrades("Confirmé")} disabled={isSaving}>
                  <CheckCircle2 className="w-6 h-6 mr-3" /> Publier T1
                </Button>
              </>
            )}
            {isConfirmed && (
              <Badge className="bg-accent text-white h-16 px-10 rounded-[1.5rem] font-black flex gap-4 text-lg shadow-2xl border-none">
                <CheckCircle2 className="w-8 h-8" /> Évaluation Verrouillée
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <Card className="xl:col-span-1 vivid-box border-none shadow-2xl h-fit">
            <CardHeader className="p-10 border-b border-slate-50">
              <CardTitle className="text-[#0F172A] flex items-center gap-3 text-2xl font-black tracking-tighter">
                <Sparkles className="w-6 h-6 text-primary" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Choisir la Classe</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-16 rounded-2xl focus:ring-primary/20 text-lg font-bold">
                    <SelectValue placeholder="Sél. Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6EME D">6ème D</SelectItem>
                    <SelectItem value="3EME A">3ème A</SelectItem>
                    <SelectItem value="TLE D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-16 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Sél. Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="SVT">SVT</SelectItem>
                    <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type d'Évaluation</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-16 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Sél. Type" />
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

          <Card className="xl:col-span-3 vivid-box border-none shadow-2xl overflow-hidden bg-white">
            <CardHeader className="p-12 pb-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-3xl font-black text-[#0F172A] tracking-tighter">Registre de Saisie</CardTitle>
                  <CardDescription className="text-xl font-bold mt-2 text-slate-600">
                    {selectedClass && selectedSubject ? `${selectedClass} • ${selectedSubject}` : "Veuillez configurer l'évaluation."}
                  </CardDescription>
                </div>
                {isConfirmed && <Badge variant="outline" className="border-destructive text-destructive font-black h-8 px-6 text-[10px] uppercase tracking-[0.2em] bg-destructive/5">Lecture Seule</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                  <AlertCircle className="w-24 h-24 mb-6 opacity-10" />
                  <p className="text-2xl font-black uppercase tracking-[0.2em]">Sélectionnez une classe</p>
                </div>
              ) : loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-40">
                   <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                   <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">Chargement du registre...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-100">
                        <TableHead className="text-[#0F172A] font-black h-20 pl-12 text-xs uppercase tracking-[0.2em]">Élève</TableHead>
                        <TableHead className="text-[#0F172A] font-black h-20 w-64 text-center text-xs uppercase tracking-[0.2em]">Note / 20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students?.map((s) => (
                        <TableRow key={s.id} className="hover:bg-slate-50/50 transition-all border-slate-100">
                          <TableCell className="pl-12 py-8">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner border-2 border-primary/5">
                                  {(s.lastName?.[0] || s.id[4] || "?").toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-black text-[#0F172A] text-xl tracking-tight">{(s.lastName || "En attente").toUpperCase()} {s.firstName || ""}</p>
                                  <p className="text-[10px] text-slate-400 font-black font-mono tracking-tighter uppercase mt-1">{s.id}</p>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-8 pr-12">
                            <Input 
                              type="number" 
                              max="20" 
                              min="0"
                              step="0.25"
                              placeholder="00.00" 
                              className={cn(
                                "h-20 text-center text-5xl font-black rounded-2xl border-4 transition-all focus:ring-8 focus:ring-primary/5",
                                isConfirmed 
                                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-100 text-primary focus:border-primary shadow-2xl"
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
                          <TableCell colSpan={2} className="text-center py-40 text-slate-400 italic font-bold text-xl">
                            Aucun élève inscrit trouvé pour cette classe.
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
