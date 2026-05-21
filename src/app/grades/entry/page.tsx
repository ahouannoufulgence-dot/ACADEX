
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function GradesEntryPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Charger les élèves de la classe sélectionnée
  const studentsQuery = useMemo(() => {
    if (!db || !selectedClass) return null;
    return query(collection(db, "students"), where("gradeLevel", "==", selectedClass), where("status", "==", "Actif"));
  }, [db, selectedClass]);

  const { data: students, loading: loadingStudents } = useCollection(studentsQuery);

  // Charger les notes déjà existantes pour ce type/classe/matière pour vérifier le statut
  const existingGradesQuery = useMemo(() => {
    if (!db || !selectedClass || !selectedSubject || !selectedType) return null;
    return query(
      collection(db, "grades"), 
      where("subjectName", "==", selectedSubject),
      where("type", "==", selectedType),
      where("term", "==", "Trimestre 2") // Exemple fixe
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
        term: "Trimestre 2",
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
      description: status === "Confirmé" ? "Seul le directeur peut désormais modifier ces notes." : "Vous pourrez revenir plus tard.",
    });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Saisie des Notes</h1>
            <p className="text-muted-foreground">Enregistrez les évaluations. Une fois confirmées, elles sont verrouillées.</p>
          </div>
          <div className="flex gap-2">
            {!isConfirmed && (
              <>
                <Button variant="outline" className="border-white/10 text-white" onClick={() => saveGrades("Brouillon")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Sauvegarder Brouillon
                </Button>
                <Button className="bg-primary text-white font-bold" onClick={() => saveGrades("Confirmé")} disabled={isSaving}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmer et Publier
                </Button>
              </>
            )}
            {isConfirmed && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" /> Notes Confirmées (Lecture seule)
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 glass-card border-none shadow-xl h-fit">
            <CardHeader>
              <CardTitle className="text-white text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Classe</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white/5 border-white/10">
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
                <label className="text-xs font-bold text-muted-foreground uppercase">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Anglais">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Évaluation</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/5 border-white/10">
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

          <Card className="md:col-span-2 glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Liste de saisie</CardTitle>
              <CardDescription>
                {selectedClass && selectedSubject ? `${selectedClass} • ${selectedSubject}` : "Veuillez configurer la classe et la matière."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground italic">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                  Sélectionnez une classe pour commencer
                </div>
              ) : loadingStudents ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5">
                        <TableHead className="text-white">Élève</TableHead>
                        <TableHead className="text-white w-32">Note / 20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students?.map((s) => (
                        <TableRow key={s.id} className="hover:bg-white/5 border-white/5">
                          <TableCell className="font-bold text-white">
                             {s.lastName?.toUpperCase()} {s.firstName}
                             <p className="text-[10px] text-muted-foreground font-mono">{s.id}</p>
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              max="20" 
                              min="0"
                              step="0.25"
                              placeholder="00.00" 
                              className="bg-white/5 border-white/10 h-10 text-center text-accent font-bold"
                              value={grades[s.id] || ""}
                              onChange={(e) => handleGradeChange(s.id, e.target.value)}
                              disabled={isConfirmed}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {students?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
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
