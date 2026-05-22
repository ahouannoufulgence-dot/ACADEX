
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Search, TrendingUp, Filter, ArrowUpRight, Edit3, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
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
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2 tracking-tight">Contrôle des Notes</h1>
            <p className="text-slate-500 text-lg font-medium">Supervision et droit de rectification directionnel.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#14532D]/5 border border-[#14532D]/10 flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-[#14532D]" />
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#14532D] uppercase tracking-widest leading-none">Statut</span>
                <span className="text-xs font-bold text-[#111827]">Super-Administrateur</span>
             </div>
          </div>
        </div>

        <Card className="premium-card border-none shadow-2xl overflow-hidden">
          <CardHeader className="p-8 md:p-10 border-b border-slate-50">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
                <Input 
                  placeholder="Rechercher par élève ou matière..." 
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#14532D]/10 font-medium text-[#111827]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                 <Badge variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50 text-slate-500 font-bold flex gap-2">
                    <Filter className="w-4 h-4" /> Filtres
                 </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-[#14532D] border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronisation des notes...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="text-[#111827] font-bold h-16 pl-10 text-xs uppercase tracking-[0.2em]">Élève</TableHead>
                      <TableHead className="text-[#111827] font-bold h-16 text-xs uppercase tracking-[0.2em]">Évaluation</TableHead>
                      <TableHead className="text-[#111827] font-bold h-16 text-center text-xs uppercase tracking-[0.2em]">Note / 20</TableHead>
                      <TableHead className="text-[#111827] font-bold h-16 text-xs uppercase tracking-[0.2em]">Statut</TableHead>
                      <TableHead className="text-[#111827] font-bold h-16 text-xs uppercase tracking-[0.2em]">Origine</TableHead>
                      <TableHead className="text-right pr-10 text-[#111827] font-bold h-16 text-xs uppercase tracking-[0.2em]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                        <TableCell className="pl-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#111827] font-bold shadow-inner">
                                {g.studentName?.[0]}
                              </div>
                              <span className="font-bold text-[#111827] text-base">{g.studentName}</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div>
                            <p className="font-bold text-[#111827]">{g.subjectName}</p>
                            <p className="text-[10px] text-accent uppercase font-black tracking-widest">{g.type}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-6">
                          <Badge className="bg-[#14532D]/10 text-[#14532D] font-black text-xl px-4 py-2 border-none">
                            {g.value}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6">
                          <Badge className={cn(
                            "text-[10px] font-bold px-3 py-1 h-7 uppercase tracking-widest border-none",
                            g.status === "Confirmé" ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-amber-400/10 text-amber-500"
                          )} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Saisi par :</p>
                          <p className="text-xs font-medium text-slate-500">{g.updatedBy}</p>
                        </TableCell>
                        <TableCell className="text-right pr-10 py-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-10 px-4 text-[#14532D] hover:text-[#14532D] hover:bg-[#14532D]/5 rounded-xl font-bold gap-2"
                                onClick={() => {
                                  setEditingGrade(g);
                                  setNewValue(g.value.toString());
                                }}
                              >
                                <Edit3 className="w-4 h-4" /> Rectifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="premium-card border-none shadow-2xl sm:max-w-[400px]">
                              <DialogHeader className="space-y-4">
                                <div className="w-14 h-14 bg-[#14532D]/10 rounded-2xl flex items-center justify-center text-[#14532D]">
                                  <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                  <DialogTitle className="text-2xl font-bold">Correction Direction</DialogTitle>
                                  <CardDescription className="text-base">
                                    Ajustement de la note de <b>{editingGrade?.studentName}</b>.
                                  </CardDescription>
                                </div>
                              </DialogHeader>
                              <div className="py-8 space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valeur Rectifiée (Note / 20)</label>
                                <Input 
                                  type="number" 
                                  step="0.25" 
                                  max="20"
                                  className="h-16 text-center text-4xl font-black text-[#14532D] bg-slate-50 border-none rounded-2xl focus-visible:ring-0"
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button className="bg-[#14532D] hover:bg-[#166534] text-white font-bold w-full h-14 rounded-2xl shadow-xl transition-all active:scale-95" onClick={handleUpdate}>
                                  Confirmer la Rectification
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredGrades.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-32 text-slate-300 italic font-bold">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="w-16 h-16 opacity-10 mb-4" />
                            Aucune note trouvée dans le registre.
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
