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
        {/* Header - Vivid Premium */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Contrôle des Notes</h1>
            <p className="text-[#0F172A] text-2xl font-black">Supervision et pilotage pédagogique ACADEX.</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-primary text-white flex items-center gap-6 shadow-[0_30px_100px_rgba(20,83,45,0.4)] border-4 border-white/20">
             <div className="p-4 bg-white rounded-2xl shadow-2xl rotate-3">
                <ShieldCheck className="w-10 h-10 text-primary" />
             </div>
             <div className="flex flex-col">
                <span className="text-[12px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-1">Autorité Élite</span>
                <span className="text-2xl font-black tracking-tight">Directeur Académique</span>
             </div>
          </div>
        </div>

        {/* Search and Filters - Ultra Clear */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-10 md:p-14 border-b-4 border-slate-50 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between gap-10">
              <div className="relative w-full max-w-2xl group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-[#0F172A] transition-all" />
                <Input 
                  placeholder="Rechercher un élève, une classe ou une matière..." 
                  className="pl-20 h-20 bg-white border-4 border-slate-100 rounded-[2rem] focus-visible:ring-8 focus-visible:ring-primary/10 font-black text-2xl text-[#0F172A] shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-6">
                 <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-4 border-slate-100 bg-white text-[#0F172A] font-black flex gap-4 hover:bg-slate-50 transition-all shadow-2xl text-lg">
                    <Filter className="w-6 h-6 text-primary" /> 
                    <span className="uppercase tracking-widest text-sm">Filtrer par Classe</span>
                 </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-48 space-y-10">
                <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin shadow-2xl" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.4em] text-xl">Accès au registre sécurisé...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-24">
                      <TableHead className="text-white font-black pl-16 text-xs uppercase tracking-[0.3em]">Identité Élève</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Évaluation</TableHead>
                      <TableHead className="text-white font-black text-center text-xs uppercase tracking-[0.3em]">Score / 20</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Validation</TableHead>
                      <TableHead className="text-right pr-16 text-white font-black text-xs uppercase tracking-[0.3em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                        <TableCell className="pl-16 py-10">
                           <div className="flex items-center gap-8">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center font-black text-2xl shadow-2xl border-2 border-white/20">
                                {g.studentName?.[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[#0F172A] text-2xl tracking-tighter uppercase">{g.studentName}</span>
                                <span className="text-xs font-black font-mono text-primary uppercase tracking-widest">{g.studentId}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-10">
                          <div className="space-y-2">
                            <p className="font-black text-[#0F172A] text-xl tracking-tight">{g.subjectName}</p>
                            <Badge variant="outline" className="text-[10px] text-primary border-2 border-primary/20 bg-white px-5 h-8 font-black uppercase tracking-[0.2em]">{g.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-10">
                          <div className="inline-block p-1 bg-primary/10 rounded-[1.5rem] border-2 border-primary/20">
                             <div className="bg-white text-primary font-black text-5xl px-10 py-5 rounded-2xl shadow-2xl">
                                {g.value}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-10">
                          <Badge className={cn(
                            "text-[10px] font-black px-6 py-2 h-10 uppercase tracking-[0.2em] border-none shadow-xl",
                            g.status === "Confirmé" ? "bg-accent text-white" : "bg-primary text-white"
                          )} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-16 py-10">
                          <div className="flex justify-end gap-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="h-16 px-10 bg-primary text-white hover:bg-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest gap-4 shadow-2xl transition-all"
                                  onClick={() => runAiAnalysis(g.studentId, g.studentName)}
                                >
                                  <BrainCircuit className="w-6 h-6" /> Bilan IA
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[3.5rem] border-none shadow-[0_50px_150px_rgba(0,0,0,0.3)] sm:max-w-[700px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-12 bg-primary text-white border-b-8 border-accent">
                                  <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl animate-pulse">
                                      <BrainCircuit className="w-14 h-14" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-5xl font-black tracking-tighter">Conseiller Pédagogique IA</DialogTitle>
                                      <DialogDescription className="text-white font-black text-xl mt-2">
                                        Analyse stratégique : <br/><b>{selectedStudentForAi?.name}</b>
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-12 bg-[#F1F5F9]">
                                  {isAiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 space-y-8">
                                      <Loader2 className="w-20 h-20 animate-spin text-primary" />
                                      <p className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em]">Génération du rapport d'excellence...</p>
                                    </div>
                                  ) : aiAnalysis ? (
                                    <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                                      <div className="grid grid-cols-2 gap-8">
                                        <div className="p-8 rounded-[2.5rem] bg-white shadow-2xl border-4 border-slate-50">
                                          <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-accent text-white rounded-2xl shadow-xl"><Award className="w-6 h-6" /></div>
                                            <p className="text-xs font-black uppercase text-slate-400 tracking-[0.25em]">Forces Académiques</p>
                                          </div>
                                          <div className="flex flex-wrap gap-3">
                                            {aiAnalysis.strengths.map((s, i) => (
                                              <Badge key={i} className="bg-accent/10 text-accent border-2 border-accent/20 font-black text-[11px] px-5 py-1.5 rounded-full">{s}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-white shadow-2xl border-4 border-slate-50">
                                          <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-primary text-white rounded-2xl shadow-xl"><TrendingUp className="w-6 h-6" /></div>
                                            <p className="text-xs font-black uppercase text-slate-400 tracking-[0.25em]">Axe de Progrès</p>
                                          </div>
                                          <div className="flex flex-wrap gap-3">
                                            {aiAnalysis.weaknesses.map((w, i) => (
                                              <Badge key={i} className="bg-primary/10 text-primary border-2 border-primary/20 font-black text-[11px] px-5 py-1.5 rounded-full">{w}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-10 rounded-[3rem] bg-white shadow-2xl border-4 border-primary/10 space-y-6">
                                        <div className="flex items-center gap-4">
                                          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                          <p className="text-base font-black uppercase text-primary tracking-[0.3em]">Diagnostic ACADEX AI</p>
                                        </div>
                                        <p className="text-2xl font-black text-[#0F172A] leading-tight italic">"{aiAnalysis.overallAssessment}"</p>
                                      </div>

                                      <div className="p-10 rounded-[2.5rem] bg-primary text-white shadow-2xl space-y-4 border-4 border-white/20">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Plan d'action prioritaire</p>
                                        <p className="text-xl font-black leading-snug">{aiAnalysis.advice}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-24 text-slate-400">
                                      <AlertCircle className="w-20 h-20 mx-auto mb-6 opacity-20" />
                                      <p className="text-2xl font-black uppercase tracking-widest">Échec de l'analyse</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter className="p-10 bg-white border-t-4 border-slate-50">
                                  <Button className="bg-slate-900 hover:bg-primary text-white font-black h-18 rounded-[2rem] w-full text-lg shadow-2xl transition-all" onClick={() => setAiAnalysis(null)}>
                                    Fermer le Dossier IA
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="h-16 px-10 border-4 border-slate-100 bg-white text-[#0F172A] hover:bg-primary hover:text-white hover:border-primary rounded-2xl font-black text-xs uppercase tracking-widest gap-4 shadow-2xl transition-all"
                                  onClick={() => {
                                    setEditingGrade(g);
                                    setNewValue(g.value.toString());
                                  }}
                                >
                                  <Edit3 className="w-6 h-6" /> Rectifier
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="vivid-box border-none shadow-[0_60px_180px_rgba(0,0,0,0.4)] sm:max-w-[500px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-12 bg-slate-900 text-white border-b-8 border-primary">
                                  <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-6">
                                      <Sparkles className="w-12 h-12" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-4xl font-black tracking-tighter">Ajustement Élite</DialogTitle>
                                      <DialogDescription className="text-white font-black text-lg mt-1 opacity-80">
                                        Correction : <b>{editingGrade?.studentName}</b>
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-12 space-y-10 bg-white">
                                  <div className="space-y-6">
                                    <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-4">Nouvelle Note / 20</label>
                                    <Input 
                                      type="number" 
                                      step="0.25" 
                                      max="20"
                                      min="0"
                                      className="h-32 text-center text-8xl font-black text-primary bg-[#F1F5F9] border-4 border-slate-100 rounded-[3rem] focus-visible:ring-0 focus-visible:border-primary shadow-inner"
                                      value={newValue}
                                      onChange={(e) => setNewValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="p-12 pt-0">
                                  <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-24 rounded-[2.5rem] shadow-[0_30px_80px_rgba(20,83,45,0.4)] transition-all text-2xl border-4 border-white/10" onClick={handleUpdate}>
                                    Confirmer la Rectification
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredGrades.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-64">
                          <div className="flex flex-col items-center space-y-10">
                            <div className="p-16 bg-white rounded-[4rem] border-8 border-slate-50 shadow-inner">
                               <AlertCircle className="w-32 h-32 text-slate-100" />
                            </div>
                            <p className="text-3xl font-black uppercase text-[#0F172A] tracking-[0.3em] opacity-40">Aucune donnée à superviser</p>
                          </div>
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
    </DashboardLayout>
  );
}