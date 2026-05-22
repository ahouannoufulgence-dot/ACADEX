
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

  const studentsQuery = useMemo(() => {
    if (!db || !selectedClass) return null;
    return query(collection(db, "students"), where("gradeLevel", "==", selectedClass), where("status", "==", "Actif"));
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
    }
  }, [existingGrades]);

  const handleGradeChange = (studentId: string, value: string) => {
    if (isConfirmed) return;
    setGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const saveGrades = (status: "Brouillon" | "Confirmé") => {
    if (!db || !selectedSubject || !selectedType) return;
    setIsSaving(true);

    const userStr = localStorage.getItem("acadex_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Inconnu" };

    students?.forEach(student => {
      const gradeValue = grades[student.id];
      if (gradeValue === undefined || gradeValue === "") return;

      const gradeId = `${student.id}-${selectedSubject}-${selectedType}`.replace(/\s+/g, '-');
      const gradeRef = doc(db, "grades", gradeId);
      
      const gradeData = {
        studentId: student.id,
        studentName: `${student.lastName} ${student.firstName}`,
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
      description: status === "Confirmé" ? "Les notes sont maintenant verrouillées." : "Modifications sauvegardées.",
    });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Saisie des Notes (T1)</h1>
            <p className="text-slate-500 text-lg font-medium">Enregistrement des premières évaluations de l'année.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {!isConfirmed && (
              <>
                <Button variant="outline" className="border-slate-200 h-14 px-8 rounded-2xl font-bold text-[#111827] shadow-sm bg-white" onClick={() => saveGrades("Brouillon")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />} Enregistrer Brouillon
                </Button>
                <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 px-8 rounded-2xl shadow-xl transition-all active:scale-95" onClick={() => saveGrades("Confirmé")} disabled={isSaving}>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Publier & Verrouiller
                </Button>
              </>
            )}
            {isConfirmed && (
              <Badge className="bg-[#16A34A] text-white h-14 px-8 rounded-2xl font-bold flex gap-3 text-sm shadow-lg">
                <CheckCircle2 className="w-5 h-5" /> Évaluation Confirmée
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          <Card className="xl:col-span-1 premium-card border-none shadow-2xl h-fit">
            <CardHeader className="p-8">
              <CardTitle className="text-[#111827] flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-5 h-5 text-[#14532D]" /> Configurer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classe</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl focus:ring-[#14532D]/20">
                    <SelectValue placeholder="Choisir une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6EME D">6ème D</SelectItem>
                    <SelectItem value="3EME A">3ème A</SelectItem>
                    <SelectItem value="TLE D">Tle D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl">
                    <SelectValue placeholder="Choisir la matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type d'Évaluation</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl">
                    <SelectValue placeholder="Type de devoir" />
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

          <Card className="xl:col-span-3 premium-card border-none shadow-2xl overflow-hidden">
            <CardHeader className="p-10 pb-4 border-b border-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-[#111827]">Registre de Saisie</CardTitle>
                  <CardDescription className="text-base font-medium mt-1">
                    {selectedClass && selectedSubject ? `${selectedClass} • ${selectedSubject}` : "Veuillez sélectionner les paramètres."}
                  </CardDescription>
                </div>
                {isConfirmed && <Badge variant="outline" className="border-[#B91C1C] text-[#B91C1C] font-bold h-7 px-4">Lecture Seule</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                  <AlertCircle className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-lg font-bold">Sélectionnez une classe pour commencer</p>
                </div>
              ) : loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-32">
                   <Loader2 className="w-10 h-10 animate-spin text-[#14532D] mb-4" />
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement de la liste...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="text-[#111827] font-bold h-16 pl-10 text-xs uppercase tracking-widest">Élève</TableHead>
                        <TableHead className="text-[#111827] font-bold h-16 w-48 text-center text-xs uppercase tracking-widest">Note / 20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students?.map((s) => (
                        <TableRow key={s.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                          <TableCell className="pl-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#111827] font-bold shadow-inner">
                                  {s.lastName?.[0]}{s.firstName?.[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-[#111827] text-lg">{s.lastName?.toUpperCase()} {s.firstName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{s.id}</p>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-6 pr-10">
                            <Input 
                              type="number" 
                              max="20" 
                              min="0"
                              step="0.25"
                              placeholder="00.00" 
                              className={cn(
                                "h-14 text-center text-2xl font-black rounded-xl border-slate-100 bg-white shadow-sm transition-all focus:ring-2 focus:ring-[#14532D]/20",
                                isConfirmed ? "opacity-50 cursor-not-allowed text-slate-400" : "text-[#14532D]"
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
                          <TableCell colSpan={2} className="text-center py-20 text-slate-400 italic font-medium">
                            Aucun élève actif trouvé dans cette classe.
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
