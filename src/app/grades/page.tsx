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
      <div className="space-y-12 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Contrôle des Notes</h1>
            <p className="text-[#0F172A] text-2xl font-black">Supervision et pilotage pédagogique ACADEX.</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-primary text-white flex items-center gap-5 shadow-2xl border-4 border-white/20">
             <div className="p-3.5 bg-white rounded-xl shadow-xl rotate-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-1">Autorité Élite</span>
                <span className="text-xl font-black tracking-tight">Directeur Académique</span>
             </div>
          </div>
        </div>

        {/* List */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-10 md:p-12 border-b-4 border-slate-50 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between gap-10">
              <div className="relative w-full max-w-2xl group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0F172A] opacity-30" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-18 h-18 bg-white border-4 border-slate-100 rounded-[1.5rem] focus-visible:ring-8 focus-visible:ring-primary/10 font-black text-xl text-[#0F172A] shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-18 px-10 rounded-[1.5rem] border-4 border-slate-100 bg-white text-[#0F172A] font-black flex gap-4 hover:bg-slate-50 transition-all shadow-xl text-lg">
                <Filter className="w-5 h-5 text-primary" /> 
                <span className="uppercase tracking-widest text-sm">Filtrer</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="w-16 h-16 border-6 border-primary border-t-transparent rounded-full animate-spin shadow-xl" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.4em] text-sm mt-8">Accès sécurisé...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-20">
                      <TableHead className="text-white font-black pl-12 text-[10px] uppercase tracking-[0.3em]">Élève</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Évaluation</TableHead>
                      <TableHead className="text-white font-black text-center text-[10px] uppercase tracking-[0.3em]">Score</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.3em]">État</TableHead>
                      <TableHead className="text-right pr-12 text-white font-black text-[10px] uppercase tracking-[0.3em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                        <TableCell className="pl-12 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-xl border-2 border-white/20">
                                {g.studentName?.[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[#0F172A] text-xl tracking-tighter uppercase">{g.studentName}</span>
                                <span className="text-[10px] font-black font-mono text-primary uppercase">{g.studentId}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <p className="font-black text-[#0F172A] text-lg">{g.subjectName}</p>
                          <Badge variant="outline" className="text-[9px] text-primary border-2 border-primary/10 bg-white px-3 h-6 font-black uppercase">{g.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center py-8">
                          <div className="inline-block p-1 bg-primary/10 rounded-xl border-2 border-primary/20">
                             <div className="bg-white text-primary font-black text-3xl px-6 py-2 rounded-lg shadow-xl">
                                {g.value}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <Badge className={cn(
                            "text-[9px] font-black px-4 py-1.5 h-8 uppercase border-none shadow-lg",
                            g.status === "Confirmé" ? "bg-accent text-white" : "bg-primary text-white"
                          )} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-12 py-8">
                          <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="h-12 px-6 bg-primary text-white hover:bg-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest gap-2 shadow-xl"
                                  onClick={() => runAiAnalysis(g.studentId, g.studentName)}
                                >
                                  <BrainCircuit className="w-4 h-4" /> Bilan IA
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[2.5rem] border-none shadow-[0_50px_150px_rgba(0,0,0,0.3)] sm:max-w-[600px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-10 bg-primary text-white border-b-8 border-accent">
                                  <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                      <BrainCircuit className="w-10 h-10" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-3xl font-black tracking-tighter">Conseiller IA</DialogTitle>
                                      <DialogDescription className="text-white font-black text-lg mt-1">
                                        Analyse : {selectedStudentForAi?.name}
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-10 bg-[#F1F5F9] max-h-[60vh] overflow-y-auto">
                                  {isAiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                      <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Génération du rapport...</p>
                                    </div>
                                  ) : aiAnalysis ? (
                                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl bg-white shadow-xl border-4 border-slate-50">
                                          <div className="flex items-center gap-3 mb-4">
                                            <Award className="w-5 h-5 text-accent" />
                                            <p className="text-[10px] font-black uppercase text-slate-400">Forces</p>
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.strengths.map((s, i) => (
                                              <Badge key={i} className="bg-accent/10 text-accent border-none font-black text-[10px]">{s}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white shadow-xl border-4 border-slate-50">
                                          <div className="flex items-center gap-3 mb-4">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                            <p className="text-[10px] font-black uppercase text-slate-400">Progrès</p>
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.weaknesses.map((w, i) => (
                                              <Badge key={i} className="bg-primary/10 text-primary border-none font-black text-[10px]">{w}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-8 rounded-[2rem] bg-white shadow-xl border-4 border-primary/10 space-y-4">
                                        <div className="flex items-center gap-3">
                                          <Sparkles className="w-6 h-6 text-primary" />
                                          <p className="text-sm font-black uppercase text-primary tracking-widest">Diagnostic</p>
                                        </div>
                                        <p className="text-xl font-black text-[#0F172A] leading-tight italic">"{aiAnalysis.overallAssessment}"</p>
                                      </div>

                                      <div className="p-8 rounded-[2rem] bg-primary text-white shadow-xl space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Plan d'action</p>
                                        <p className="text-lg font-black leading-snug">{aiAnalysis.advice}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-20 text-slate-400">
                                      <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                      <p className="text-xl font-black uppercase tracking-widest">Échec de l'analyse</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter className="p-8 bg-white border-t-4 border-slate-50">
                                  <Button className="bg-slate-900 hover:bg-primary text-white font-black h-16 rounded-[1.5rem] w-full text-lg shadow-xl" onClick={() => setAiAnalysis(null)}>
                                    Fermer le Dossier
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="h-12 px-6 border-4 border-slate-100 bg-white text-[#0F172A] hover:bg-primary hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest gap-2 shadow-xl"
                                  onClick={() => {
                                    setEditingGrade(g);
                                    setNewValue(g.value.toString());
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" /> Rectifier
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="vivid-box border-none shadow-2xl sm:max-w-[450px] p-0 overflow-hidden bg-white rounded-[2rem]">
                                <DialogHeader className="p-8 bg-slate-900 text-white border-b-8 border-primary">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl rotate-6">
                                      <Sparkles className="w-8 h-8" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-2xl font-black tracking-tighter">Ajustement</DialogTitle>
                                      <DialogDescription className="text-white font-black text-sm opacity-80">
                                        Correction : {editingGrade?.studentName}
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-10 space-y-6 bg-white">
                                  <div className="space-y-4">
                                    <label className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Nouvelle Note / 20</label>
                                    <Input 
                                      type="number" 
                                      step="0.25" 
                                      max="20"
                                      min="0"
                                      className="h-24 text-center text-6xl font-black text-primary bg-slate-50 border-4 border-slate-100 rounded-[1.5rem] focus-visible:ring-0 shadow-inner"
                                      value={newValue}
                                      onChange={(e) => setNewValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="p-8 pt-0">
                                  <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-18 rounded-[1.5rem] shadow-xl text-xl border-4 border-white/10" onClick={handleUpdate}>
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