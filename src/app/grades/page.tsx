
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
      <div className="space-y-10 animate-fade-up">
        {/* Header - Vivid Premium */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-[#111827] mb-2 tracking-tighter">Contrôle des Notes</h1>
            <p className="text-slate-500 text-lg font-bold">Supervision et pilotage pédagogique ACADEX.</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white border-2 border-primary/10 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
             <div className="p-3 bg-primary rounded-2xl shadow-lg rotate-3">
                <ShieldCheck className="w-8 h-8 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Autorité</span>
                <span className="text-lg font-black text-[#111827] tracking-tight">Super-Administrateur</span>
             </div>
          </div>
        </div>

        {/* Search and Filters - Ultra Clear */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="relative w-full max-w-xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary transition-all" />
                <Input 
                  placeholder="Rechercher un élève, une classe ou une matière..." 
                  className="pl-16 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] focus-visible:ring-4 focus-visible:ring-primary/5 font-bold text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                 <Button variant="outline" className="h-16 px-8 rounded-[1.5rem] border-2 border-slate-100 bg-white text-slate-500 font-black flex gap-3 hover:bg-slate-50 transition-all shadow-lg">
                    <Filter className="w-5 h-5 text-primary" /> 
                    <span className="uppercase tracking-widest text-xs">Filtrer par Classe</span>
                 </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Chargement du registre...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-100 h-20">
                      <TableHead className="text-[#111827] font-black pl-12 text-xs uppercase tracking-[0.25em]">Élève</TableHead>
                      <TableHead className="text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Matière & Type</TableHead>
                      <TableHead className="text-[#111827] font-black text-center text-xs uppercase tracking-[0.25em]">Note / 20</TableHead>
                      <TableHead className="text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Statut</TableHead>
                      <TableHead className="text-right pr-12 text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-slate-50 transition-all border-slate-100 group">
                        <TableCell className="pl-12 py-8">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-primary/5">
                                {g.studentName?.[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-[#111827] text-xl tracking-tight">{g.studentName}</span>
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-tighter">{g.studentId}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <div className="space-y-1">
                            <p className="font-black text-[#111827] text-lg">{g.subjectName}</p>
                            <Badge variant="outline" className="text-[9px] text-primary border-primary/20 bg-white px-3 font-black uppercase tracking-widest">{g.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-8">
                          <div className="inline-block p-1 bg-primary/5 rounded-2xl border border-primary/10">
                             <div className="bg-white text-primary font-black text-4xl px-8 py-4 rounded-xl shadow-xl">
                                {g.value}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <Badge className={cn(
                            "text-[10px] font-black px-4 py-1.5 h-8 uppercase tracking-[0.15em] border-none shadow-sm",
                            g.status === "Confirmé" ? "bg-accent/20 text-accent" : "bg-amber-400/20 text-amber-600"
                          )} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-12 py-8">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="h-14 px-6 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-sm transition-all"
                                  onClick={() => runAiAnalysis(g.studentId, g.studentName)}
                                >
                                  <BrainCircuit className="w-5 h-5" /> Bilan IA
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[2.5rem] border-none shadow-2xl sm:max-w-[600px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-10 bg-primary text-white border-b-4 border-accent">
                                  <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-2xl animate-pulse">
                                      <BrainCircuit className="w-12 h-12" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-4xl font-black tracking-tighter">Conseiller Pédagogique IA</DialogTitle>
                                      <DialogDescription className="text-primary-foreground/80 font-bold text-lg">
                                        Analyse du dossier de : <br/><b>{selectedStudentForAi?.name}</b>
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-10 bg-slate-50/50">
                                  {isAiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                      <Loader2 className="w-16 h-16 animate-spin text-primary" />
                                      <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Calcul de la stratégie...</p>
                                    </div>
                                  ) : aiAnalysis ? (
                                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-3xl bg-white shadow-xl border-2 border-slate-100">
                                          <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-accent/10 rounded-xl"><Award className="w-5 h-5 text-accent" /></div>
                                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Forces</p>
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.strengths.map((s, i) => (
                                              <Badge key={i} className="bg-accent/10 text-accent border-none font-bold text-[10px] px-3">{s}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white shadow-xl border-2 border-slate-100">
                                          <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-amber-100 rounded-xl"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
                                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Vigilances</p>
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.weaknesses.map((w, i) => (
                                              <Badge key={i} className="bg-amber-100 text-amber-600 border-none font-bold text-[10px] px-3">{w}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-8 rounded-[2.5rem] bg-white shadow-2xl border-4 border-primary/5 space-y-4">
                                        <div className="flex items-center gap-3">
                                          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                          <p className="text-sm font-black uppercase text-primary tracking-[0.2em]">Diagnostic IA</p>
                                        </div>
                                        <p className="text-xl font-bold text-[#111827] leading-relaxed italic">"{aiAnalysis.overallAssessment}"</p>
                                      </div>

                                      <div className="p-8 rounded-[2rem] bg-primary text-white shadow-xl space-y-3">
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60">Plan d'action suggéré</p>
                                        <p className="text-lg font-medium leading-relaxed">{aiAnalysis.advice}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-20 text-slate-300">
                                      <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                      <p className="text-xl font-black uppercase">Erreur lors de l'analyse</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter className="p-8 bg-white border-t border-slate-100">
                                  <Button className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black h-14 rounded-2xl w-full" onClick={() => setAiAnalysis(null)}>
                                    Fermer le bilan
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-14 px-6 text-slate-500 hover:text-white hover:bg-primary rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-sm transition-all"
                                  onClick={() => {
                                    setEditingGrade(g);
                                    setNewValue(g.value.toString());
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" /> Rectifier
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="vivid-box border-none shadow-2xl sm:max-w-[450px] p-0 overflow-hidden bg-white">
                                <DialogHeader className="p-10 bg-slate-50/50 border-b border-slate-100">
                                  <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3">
                                      <Sparkles className="w-10 h-10" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-3xl font-black text-[#111827] tracking-tighter">Ajustement</DialogTitle>
                                      <DialogDescription className="text-base font-bold text-slate-500">
                                        Correction de : <br/><b>{editingGrade?.studentName}</b>
                                      </DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-10 space-y-8">
                                  <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Nouvelle Note / 20</label>
                                    <Input 
                                      type="number" 
                                      step="0.25" 
                                      max="20"
                                      min="0"
                                      className="h-24 text-center text-6xl font-black text-primary bg-slate-50 border-4 border-slate-100 rounded-[2rem] focus-visible:ring-0 focus-visible:border-primary shadow-inner"
                                      value={newValue}
                                      onChange={(e) => setNewValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="p-10 pt-0">
                                  <Button className="bg-primary hover:bg-primary/90 text-white font-black w-full h-20 rounded-[2rem] shadow-2xl transition-all text-xl" onClick={handleUpdate}>
                                    Confirmer
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
                        <TableCell colSpan={5} className="text-center py-48 text-slate-300">
                          <div className="flex flex-col items-center space-y-6">
                            <div className="p-10 bg-slate-50 rounded-[3rem] border-4 border-slate-100 shadow-inner">
                               <AlertCircle className="w-20 h-20 opacity-10" />
                            </div>
                            <p className="text-2xl font-black uppercase tracking-[0.2em] opacity-40">Aucune donnée à superviser</p>
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
