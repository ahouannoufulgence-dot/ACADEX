
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
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

  const studentsQuery = useMemo(() => {
    if (!db || !selectedClass) return null;
    return query(collection(db, "students"), where("gradeLevel", "==", selectedClass));
  }, [db, selectedClass]);

  const { data: students, loading: loadingStudents } = useCollection(studentsQuery);

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

    // Spontané : pas de await dans la boucle
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
      description: status === "Confirmé" ? "Les notes sont maintenant verrouillées." : "Modifications sauvegardées spontanément.",
    });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase">Saisie des Notes <span className="text-primary">(T1)</span></h1>
            <p className="text-[#0F172A] text-[10px] md:text-lg font-black opacity-60 uppercase tracking-widest italic">Registre numérique • 2026-2027</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isConfirmed && (
              <>
                <Button variant="outline" className="border-slate-200 h-10 md:h-12 px-6 rounded-xl font-black text-[#0F172A] shadow-md bg-white hover:bg-slate-50 uppercase text-[9px] tracking-widest" onClick={() => saveGrades("Brouillon")} disabled={isSaving}>
                   <Save className="w-4 h-4 mr-2" /> Brouillon
                </Button>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-12 px-6 rounded-xl shadow-xl transition-all active:scale-95 border-2 border-white/10 uppercase text-[9px] tracking-widest" onClick={() => saveGrades("Confirmé")} disabled={isSaving}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Publier
                </Button>
              </>
            )}
            {isConfirmed && (
              <Badge className="bg-primary text-white h-10 md:h-12 px-6 rounded-xl font-black flex gap-2 text-xs shadow-xl border-none uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> Verrouillé
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          <Card className="xl:col-span-1 vivid-box border-none shadow-xl h-fit rounded-[1.5rem] p-6">
            <CardHeader className="p-0 pb-4 border-b border-slate-50 mb-4">
              <CardTitle className="text-[#0F172A] flex items-center gap-2 text-lg font-black tracking-tighter uppercase">
                <Sparkles className="w-4 h-4 text-primary" /> Configuration
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-10 rounded-xl text-xs font-black text-[#0F172A]">
                    <SelectValue placeholder="Sél." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6EME D">6ème D</SelectItem>
                    <SelectItem value="3EME A">3ème A</SelectItem>
                    <SelectItem value="TLE D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-10 rounded-xl text-xs font-black text-[#0F172A]">
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
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-slate-50 border-2 border-slate-100 h-10 rounded-xl text-xs font-black text-[#0F172A]">
                    <SelectValue placeholder="Sél." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interrogation 1">Interrogation 1</SelectItem>
                    <SelectItem value="Interrogation 2">Interrogation 2</SelectItem>
                    <SelectItem value="Devoir Surveillé 1">Devoir Surveillé 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-3 vivid-box border-none shadow-xl overflow-hidden bg-white/95 rounded-[2rem] p-0">
            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg md:text-xl font-black text-[#0F172A] tracking-tighter uppercase">Registre</CardTitle>
                  <CardDescription className="text-[10px] md:text-sm font-black mt-0.5 text-primary uppercase tracking-widest">
                    {selectedClass && selectedSubject ? `${selectedClass} • ${selectedSubject}` : "En attente de configuration."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-200">
                  <AlertCircle className="w-12 h-12 mb-3 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest">Sélectionnez une classe</p>
                </div>
              ) : loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-20">
                   <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-900">
                      <TableRow className="border-none h-10 md:h-12">
                        <TableHead className="text-white font-black pl-6 text-[8px] md:text-[10px] uppercase tracking-widest">Élève</TableHead>
                        <TableHead className="text-white font-black text-center text-[8px] md:text-[10px] uppercase tracking-widest">Note / 20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students?.map((s) => (
                        <TableRow key={s.id} className="hover:bg-primary/5 transition-all border-slate-50">
                          <TableCell className="pl-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shadow-md">
                                  {s.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-[#0F172A] text-[11px] md:text-base tracking-tight uppercase truncate">{(s.lastName || "").toUpperCase()} {s.firstName || ""}</p>
                                  <p className="text-[7px] md:text-[9px] text-primary font-black font-mono tracking-tighter uppercase opacity-60">{s.id}</p>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-4 pr-6">
                            <Input 
                              type="number" 
                              max="20" 
                              min="0"
                              step="0.25"
                              placeholder="0.0" 
                              className={cn(
                                "h-10 md:h-12 text-center text-lg md:text-xl font-black rounded-xl border-2 transition-all",
                                isConfirmed 
                                  ? "bg-slate-50 border-slate-100 text-slate-300" 
                                  : "bg-white border-slate-100 text-primary focus:border-primary shadow-sm"
                              )}
                              value={grades[s.id] || ""}
                              onChange={(e) => handleGradeChange(s.id, e.target.value)}
                              disabled={isConfirmed}
                            />
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
