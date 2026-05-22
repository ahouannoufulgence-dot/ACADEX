"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  FileText, 
  Search, 
  TrendingUp, 
  Filter, 
  ArrowUpRight, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldCheck 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function GradesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [newValue, setNewValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      g.subjectName?.toLowerCase().includes(q)
    );
  }, [grades, searchQuery]);

  const handleUpdate = () => {
    if (!db || !editingGrade || !newValue) return;

    const gradeRef = doc(db, "grades", editingGrade.id);
    const updatedData = {
      value: Number(newValue),
      updatedBy: "Directeur (Correction Administrative)",
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
      description: `La note de ${editingGrade.studentName} a été mise à jour par la direction.` 
    });
    setEditingGrade(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-[#111827] mb-2 tracking-tighter">Contrôle des Notes</h1>
            <p className="text-slate-500 text-lg font-bold">Supervision et droit de rectification directionnel.</p>
          </div>
          <div className="p-5 rounded-3xl bg-[#14532D]/5 border-2 border-[#14532D]/10 flex items-center gap-4 shadow-xl bg-white">
             <div className="p-2 bg-[#14532D] rounded-xl shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#14532D] uppercase tracking-[0.2em] leading-none mb-1">Autorité</span>
                <span className="text-sm font-black text-[#111827] tracking-tight">Super-Administrateur</span>
             </div>
          </div>
        </div>

        <Card className="vivid-box border-none shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
          <CardHeader className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="relative w-full max-w-xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#14532D] transition-all" />
                <Input 
                  placeholder="Rechercher par élève ou matière..." 
                  className="pl-16 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] focus-visible:ring-4 focus-visible:ring-[#14532D]/5 font-bold text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                 <Button variant="outline" className="h-16 px-8 rounded-[1.5rem] border-2 border-slate-100 bg-white text-slate-500 font-black flex gap-3 hover:bg-slate-50 transition-all shadow-lg">
                    <Filter className="w-5 h-5 text-primary" /> 
                    <span className="uppercase tracking-widest text-xs">Filtres Avancés</span>
                 </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <div className="w-16 h-16 border-4 border-[#14532D] border-t-transparent rounded-full animate-spin shadow-2xl" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Synchronisation des données...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-100 h-20">
                      <TableHead className="text-[#111827] font-black pl-12 text-xs uppercase tracking-[0.25em]">Élève</TableHead>
                      <TableHead className="text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Évaluation</TableHead>
                      <TableHead className="text-[#111827] font-black text-center text-xs uppercase tracking-[0.25em]">Note / 20</TableHead>
                      <TableHead className="text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Statut</TableHead>
                      <TableHead className="text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Origine</TableHead>
                      <TableHead className="text-right pr-12 text-[#111827] font-black text-xs uppercase tracking-[0.25em]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-slate-50 transition-all border-slate-100 group">
                        <TableCell className="pl-12 py-8">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-[#14532D] font-black text-lg shadow-inner border border-primary/5">
                                {g.studentName?.[0]}
                              </div>
                              <span className="font-black text-[#111827] text-xl tracking-tight">{g.studentName}</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <div className="space-y-1">
                            <p className="font-black text-[#111827] text-lg">{g.subjectName}</p>
                            <Badge variant="outline" className="text-[9px] text-primary border-primary/20 bg-primary/5 px-2 font-black uppercase tracking-widest">{g.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-8">
                          <div className="inline-block p-1 bg-primary/5 rounded-2xl">
                             <div className="bg-white border-2 border-primary/10 text-[#14532D] font-black text-3xl px-6 py-3 rounded-xl shadow-xl">
                                {g.value}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-8">
                          <Badge className={cn(
                            "text-[10px] font-black px-4 py-1.5 h-8 uppercase tracking-[0.15em] border-none shadow-sm",
                            g.status === "Confirmé" ? "bg-[#16A34A]/20 text-[#16A34A]" : "bg-amber-400/20 text-amber-600"
                          )} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-8">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">Saisie par :</p>
                          <p className="text-sm font-bold text-slate-600 tracking-tight">{g.updatedBy}</p>
                        </TableCell>
                        <TableCell className="text-right pr-12 py-8">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-14 px-8 text-primary hover:text-white hover:bg-primary rounded-[1.25rem] font-black text-xs uppercase tracking-widest gap-3 shadow-sm border-2 border-transparent hover:border-primary/20 transition-all active:scale-95"
                                onClick={() => {
                                  setEditingGrade(g);
                                  setNewValue(g.value.toString());
                                }}
                              >
                                <Edit3 className="w-4 h-4" /> Rectifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="vivid-box border-none shadow-[0_50px_100px_rgba(0,0,0,0.3)] sm:max-w-[450px] p-0 overflow-hidden">
                              <DialogHeader className="p-10 bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-[#14532D] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3">
                                    <Sparkles className="w-10 h-10" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-3xl font-black text-[#111827] tracking-tighter">Ajustement</DialogTitle>
                                    <CardDescription className="text-base font-bold text-slate-500">
                                      Rectification de la note de <br/><b>{editingGrade?.studentName}</b>
                                    </CardDescription>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="p-10 space-y-8 bg-white">
                                <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Nouvelle Valeur (Note / 20)</label>
                                  <Input 
                                    type="number" 
                                    step="0.25" 
                                    max="20"
                                    min="0"
                                    className="h-24 text-center text-6xl font-black text-[#14532D] bg-slate-50 border-4 border-slate-100 rounded-[2rem] focus-visible:ring-0 focus-visible:border-primary transition-all shadow-inner"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                  />
                                </div>
                                <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex gap-4">
                                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                                   <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                      Cette action sera enregistrée comme une "Correction Administrative" dans l'historique de l'élève.
                                   </p>
                                </div>
                              </div>
                              <DialogFooter className="p-10 pt-0 bg-white">
                                <Button className="bg-[#14532D] hover:bg-[#064E3B] text-white font-black w-full h-20 rounded-[2rem] shadow-[0_20px_60px_rgba(20,83,45,0.4)] transition-all active:scale-95 text-xl tracking-tight" onClick={handleUpdate}>
                                  Confirmer la Correction
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredGrades.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-48 text-slate-300">
                          <div className="flex flex-col items-center space-y-6">
                            <div className="p-10 bg-slate-50 rounded-[3rem] border-4 border-slate-100 shadow-inner">
                               <AlertCircle className="w-20 h-20 opacity-10" />
                            </div>
                            <p className="text-2xl font-black uppercase tracking-[0.2em] opacity-40">Aucune note dans le registre</p>
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
