
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Search, 
  Filter, 
  Edit3, 
  ShieldCheck, 
  Sparkles,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { analyzeStudentPerformance, PedagogicalAnalysisOutput } from "@/ai/flows/pedagogical-analysis-flow";

export default function GradesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [newValue, setNewValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // IA Analysis State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<PedagogicalAnalysisOutput | null>(null);
  const [selectedStudentForAi, setSelectedStudentForAi] = useState<{id: string, name: string} | null>(null);

  const gradesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "grades"), orderBy("date", "desc"));
  }, [db]);

  const { data: grades, loading } = useCollection(gradesQuery);

  const filteredGrades = useMemo(() => {
    if (!grades) return [];
    if (!searchQuery) return grades;
    const q = searchQuery.toLowerCase();
    return grades.filter((g: any) => 
      g.studentName?.toLowerCase().includes(q) || 
      g.subjectName?.toLowerCase().includes(q) ||
      g.studentId?.toLowerCase().includes(q)
    );
  }, [grades, searchQuery]);

  const handleUpdate = () => {
    if (!db || !editingGrade || !newValue) return;

    const gradeRef = doc(db, "grades", editingGrade.id);
    const updatedData = {
      value: Number(newValue),
      updatedBy: "Direction (Rectification)",
      lastModified: serverTimestamp()
    };

    updateDoc(gradeRef, updatedData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: gradeRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ 
      title: "Note rectifiée", 
      description: `La note de ${editingGrade.studentName} a été mise à jour.` 
    });
    setEditingGrade(null);
  };

  const runAiAnalysis = async (studentId: string, studentName: string) => {
    if (!grades) return;
    setIsAiLoading(true);
    setAiAnalysis(null);
    setSelectedStudentForAi({ id: studentId, name: studentName });

    try {
      const studentGrades = grades.filter((g: any) => g.studentId === studentId);
      if (studentGrades.length === 0) {
        toast({ title: "Pas de notes", description: "Cet élève n'a pas encore de notes enregistrées." });
        setIsAiLoading(false);
        return;
      }

      const sum = studentGrades.reduce((acc: number, g: any) => acc + g.value, 0);
      const avg = sum / studentGrades.length;

      const result = await analyzeStudentPerformance({
        studentName: studentName,
        gradeLevel: "Non défini",
        overallAverage: Number(avg.toFixed(2)),
        grades: studentGrades.map((g: any) => ({
          subject: g.subjectName,
          value: g.value,
          coefficient: 1,
          classAverage: 10
        }))
      });
      setAiAnalysis(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur IA", description: "L'analyse pédagogique a échoué." });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Contrôle des Notes</h1>
            <p className="text-[#0F172A] text-[10px] md:text-xl font-black opacity-80 uppercase tracking-widest">Pilotage pédagogique ACADEX</p>
          </div>
          <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-primary text-white flex items-center gap-3 md:gap-4 shadow-xl border-2 border-white/10">
             <div className="p-2 bg-white rounded-lg shadow-md rotate-3">
                <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-primary" />
             </div>
             <div className="flex flex-col">
                <span className="text-[7px] md:text-[9px] font-black text-accent uppercase tracking-widest leading-none mb-0.5">Autorité</span>
                <span className="text-[10px] md:text-lg font-black tracking-tight">Direction Académique</span>
             </div>
          </div>
        </div>

        {/* List */}
        <Card className="vivid-box border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 border-b-2 border-slate-50 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-xl group">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#0F172A] opacity-30" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-12 h-11 md:h-12 bg-white border-2 border-slate-100 rounded-xl focus-visible:ring-4 focus-visible:ring-primary/5 font-black text-sm md:text-lg text-[#0F172A] shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 md:h-12 px-6 rounded-xl border-2 border-slate-100 bg-white text-[#0F172A] font-black flex gap-2 hover:bg-slate-50 shadow-md text-[10px] md:text-sm">
                <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> 
                <span className="uppercase tracking-widest">Filtrer</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary mb-4" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.3em] text-[8px] md:text-xs">Accès sécurisé...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-12 md:h-14">
                      <TableHead className="text-white font-black pl-6 md:pl-10 text-[8px] md:text-[10px] uppercase tracking-widest">Élève</TableHead>
                      <TableHead className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">Évaluation</TableHead>
                      <TableHead className="text-white font-black text-center text-[8px] md:text-[10px] uppercase tracking-widest">Score</TableHead>
                      <TableHead className="text-right pr-6 md:pr-10 text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                        <TableCell className="pl-6 md:pl-10 py-4 md:py-6">
                           <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs md:text-lg shadow-md border border-white/10 shrink-0">
                                {g.studentName?.[0]}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-black text-[#0F172A] text-[10px] md:text-base tracking-tighter uppercase truncate">{g.studentName}</span>
                                <span className="text-[7px] md:text-[9px] font-black font-mono text-primary uppercase">{g.studentId}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-4 md:py-6">
                          <p className="font-black text-[#0F172A] text-[10px] md:text-sm truncate">{g.subjectName}</p>
                          <Badge variant="outline" className="text-[6px] md:text-[8px] text-primary border border-primary/10 bg-white px-1.5 h-4 md:h-5 font-black uppercase">{g.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center py-4 md:py-6">
                          <div className="inline-block p-1 bg-primary/10 rounded-lg border border-primary/20">
                             <div className="bg-white text-primary font-black text-xs md:text-xl px-2 md:px-4 py-0.5 md:py-1 rounded shadow-md">
                                {g.value}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6 md:pr-10 py-4 md:py-6">
                          <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="h-7 md:h-9 px-2 md:px-4 bg-primary text-white hover:bg-slate-900 rounded-lg font-black text-[7px] md:text-[9px] uppercase tracking-widest gap-1.5 shadow-md"
                                  onClick={() => runAiAnalysis(g.studentId, g.studentName)}
                                >
                                  <BrainCircuit className="w-3 h-3 md:w-4 md:h-4" /> Bilan
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-2xl sm:max-w-[500px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-6 md:p-8 bg-primary text-white border-b-4 border-accent">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
                                      <BrainCircuit className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-lg md:text-2xl font-black tracking-tighter">Conseiller IA</DialogTitle>
                                      <DialogDescription className="text-white font-black text-xs md:text-sm mt-0.5 opacity-80">
                                        Analyse : {selectedStudentForAi?.name}
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-6 md:p-8 bg-slate-50 max-h-[60vh] overflow-y-auto">
                                  {isAiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                      <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Analyse en cours...</p>
                                    </div>
                                  ) : aiAnalysis ? (
                                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white shadow-md border-2 border-slate-100">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-3.5 h-3.5 text-accent" />
                                            <p className="text-[8px] font-black uppercase text-slate-400">Forces</p>
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {aiAnalysis.strengths.map((s, i) => (
                                              <Badge key={i} className="bg-accent/10 text-accent border-none font-black text-[7px]">{s}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white shadow-md border-2 border-slate-100">
                                          <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                            <p className="text-[8px] font-black uppercase text-slate-400">Points</p>
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {aiAnalysis.weaknesses.map((w, i) => (
                                              <Badge key={i} className="bg-primary/10 text-primary border-none font-black text-[7px]">{w}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-5 rounded-2xl bg-white shadow-md border-2 border-primary/10 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Sparkles className="w-4 h-4 text-primary" />
                                          <p className="text-[9px] font-black uppercase text-primary tracking-widest">Diagnostic</p>
                                        </div>
                                        <p className="text-xs md:text-base font-black text-[#0F172A] leading-tight italic">"{aiAnalysis.overallAssessment}"</p>
                                      </div>

                                      <div className="p-5 rounded-2xl bg-primary text-white shadow-lg space-y-2">
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Recommandations</p>
                                        <p className="text-[10px] md:text-sm font-black leading-snug">{aiAnalysis.advice}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-12 text-slate-400">
                                      <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                      <p className="text-[10px] font-black uppercase tracking-widest">Échec de l'analyse</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter className="p-6 bg-white border-t-2 border-slate-50">
                                  <Button className="bg-slate-900 hover:bg-primary text-white font-black h-12 rounded-xl w-full text-sm shadow-md" onClick={() => setAiAnalysis(null)}>
                                    Fermer
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="h-7 md:h-9 px-2 md:px-4 border-2 border-slate-100 bg-white text-[#0F172A] hover:bg-primary hover:text-white rounded-lg font-black text-[7px] md:text-[9px] uppercase tracking-widest gap-1.5 shadow-md"
                                  onClick={() => {
                                    setEditingGrade(g);
                                    setNewValue(g.value.toString());
                                  }}
                                >
                                  <Edit3 className="w-3 h-3 md:w-4 md:h-4" /> Rectifier
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="vivid-box border-none shadow-xl sm:max-w-[350px] p-0 overflow-hidden bg-white rounded-[1.5rem]">
                                <DialogHeader className="p-6 bg-slate-900 text-white border-b-4 border-primary">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg rotate-6">
                                      <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-lg md:text-xl font-black tracking-tighter">Ajustement</DialogTitle>
                                      <DialogDescription className="text-white font-black text-[8px] md:text-[10px] opacity-70">
                                        Élève : {editingGrade?.studentName}
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-8 space-y-4 bg-white">
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-1">Nouvelle Note / 20</label>
                                    <Input 
                                      type="number" 
                                      step="0.25" 
                                      max="20"
                                      min="0"
                                      className="h-16 md:h-20 text-center text-3xl md:text-4xl font-black text-primary bg-slate-50 border-2 border-slate-100 rounded-xl focus-visible:ring-0 shadow-inner"
                                      value={newValue}
                                      onChange={(e) => setNewValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="p-6 pt-0">
                                  <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-12 md:h-14 rounded-xl shadow-md text-sm md:text-base border-2 border-white/10" onClick={handleUpdate}>
                                    Confirmer
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
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
