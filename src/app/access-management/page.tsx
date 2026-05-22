"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KeyRound, ShieldCheck, Users, Copy, Trash2, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, serverTimestamp, writeBatch, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function AccessManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [bulkData, setBulkData] = useState({
    gradeLevel: "",
    count: 1
  });

  // On ne charge que les accès en attente pour la clarté
  const studentsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "students"), 
      where("status", "==", "En attente"),
      orderBy("createdAt", "desc")
    );
  }, [db]);

  const { data: students, loading } = useCollection(studentsQuery);

  const handleBulkGenerate = () => {
    if (!db || !bulkData.gradeLevel || bulkData.count < 1) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir le niveau et le nombre d'élèves."
      });
      return;
    }

    setIsGenerating(true);
    const batch = writeBatch(db);
    const classCode = bulkData.gradeLevel.replace(/\s+/g, '').toUpperCase();
    
    // Génération de codes aléatoires pour éviter les collisions en masse
    for (let i = 1; i <= bulkData.count; i++) {
      const studentNumber = Math.floor(Math.random() * 900) + 100; 
      const studentId = `ELV-${classCode}-${studentNumber}`;
      const studentRef = doc(db, "students", studentId);
      
      batch.set(studentRef, {
        id: studentId,
        gradeLevel: bulkData.gradeLevel,
        status: "En attente",
        createdAt: serverTimestamp()
      });
    }

    batch.commit()
      .then(() => {
        toast({
          title: "Génération réussie",
          description: `${bulkData.count} accès créés pour ${bulkData.gradeLevel}.`
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'students/bulk',
          operation: 'write',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    setIsGenerating(false);
    setBulkData({ gradeLevel: "", count: 1 });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    
    deleteDoc(doc(db, "students", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `students/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    toast({ 
      title: "Identifiant supprimé", 
      description: "Le code d'accès a été retiré de la base de données." 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Identifiant copié." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-up">
        {/* Header - Vivid Premium */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h1 className="text-5xl md:text-8xl font-headline font-black text-[#0F172A] mb-4 tracking-tighter">Gestion des Accès</h1>
            <p className="text-[#0F172A] text-2xl font-black">Provisionnez les accès élèves par classe avec ACADEX AI.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-20 px-14 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex gap-6 text-xl border-4 border-white/10">
                <Users className="w-8 h-8" /> Provisionner une classe
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none shadow-[0_60px_180px_rgba(0,0,0,0.4)] sm:max-w-[550px] p-0 overflow-hidden bg-white">
              <DialogHeader className="p-12 bg-primary text-white border-b-8 border-accent">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-2xl rotate-6">
                    <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <DialogTitle className="text-4xl font-black tracking-tighter">Génération par Lot</DialogTitle>
                </div>
                <CardDescription className="text-white font-black text-xl mt-4 opacity-80">Créez massivement des codes d'accès sécurisés.</CardDescription>
              </DialogHeader>

              <div className="p-12 space-y-10 bg-white">
                <div className="space-y-4">
                  <Label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Niveau / Classe (Ex: 3EME A)</Label>
                  <Input 
                    placeholder="3EME A"
                    className="bg-[#F1F5F9] border-4 border-slate-50 h-16 rounded-2xl font-black text-xl text-[#0F172A] px-6 shadow-inner" 
                    value={bulkData.gradeLevel}
                    onChange={(e) => setBulkData({...bulkData, gradeLevel: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Nombre d'élèves</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="100"
                    className="bg-[#F1F5F9] border-4 border-slate-50 h-16 rounded-2xl font-black text-xl text-[#0F172A] px-6 shadow-inner text-center" 
                    value={bulkData.count}
                    onChange={(e) => setBulkData({...bulkData, count: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <DialogFooter className="p-12 pt-0 bg-white">
                <Button 
                  className="bg-accent text-white hover:bg-slate-900 font-black w-full h-24 rounded-[2.5rem] shadow-2xl text-2xl border-4 border-white/10" 
                  onClick={handleBulkGenerate} 
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader2 className="w-10 h-10 animate-spin" /> : "Générer les identifiants"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="p-12 md:p-14 border-b-4 border-slate-50 bg-slate-50/30">
            <div>
              <CardTitle className="text-3xl font-black text-[#0F172A] tracking-tighter">Identifiants en attente d'activation</CardTitle>
              <CardDescription className="text-xl font-bold mt-2 text-slate-600">Remettez ces codes aux élèves pour qu'ils créent leur compte ACADEX.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-56">
                <Loader2 className="w-24 h-24 animate-spin text-primary mb-8" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.4em] text-xl">Accès au registre...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-24">
                      <TableHead className="text-white font-black pl-20 text-xs uppercase tracking-[0.3em]">Identifiant Personnel</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Classe Affectée</TableHead>
                      <TableHead className="text-white font-black text-xs uppercase tracking-[0.3em]">Statut Actuel</TableHead>
                      <TableHead className="text-right pr-20 text-white font-black text-xs uppercase tracking-[0.3em]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.map((u: any) => (
                      <TableRow key={u.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                        <TableCell className="pl-20 py-12">
                           <div className="flex items-center gap-10">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center font-black text-xl shadow-inner border-4 border-primary/5">
                                <KeyRound className="w-8 h-8" />
                              </div>
                              <span className="font-mono font-black text-primary text-3xl tracking-tighter">{u.id}</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-12">
                          <span className="font-black text-[#0F172A] text-2xl tracking-tighter uppercase">{u.gradeLevel}</span>
                        </TableCell>
                        <TableCell className="py-12">
                          <Badge className="bg-primary text-white text-[12px] font-black px-6 py-2.5 h-12 uppercase tracking-[0.2em] border-none shadow-2xl" variant="outline">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-20 py-12">
                          <div className="flex justify-end gap-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Button 
                              variant="ghost" 
                              className="h-16 px-8 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-primary hover:bg-primary hover:text-white transition-all shadow-xl"
                              onClick={() => copyToClipboard(u.id)}
                            >
                              <Copy className="h-6 w-6 mr-3" /> Copier
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="h-16 px-8 bg-red-50 border-4 border-red-100 rounded-2xl font-black text-destructive hover:bg-destructive hover:text-white transition-all shadow-xl"
                              onClick={() => handleDelete(u.id)}
                            >
                              <Trash2 className="h-6 w-6 mr-3" /> Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!students || students.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-64">
                          <div className="flex flex-col items-center space-y-10">
                             <div className="p-16 bg-white rounded-[4rem] border-8 border-slate-50 shadow-inner">
                                <Sparkles className="w-32 h-32 text-slate-100" />
                             </div>
                             <p className="text-4xl font-black uppercase text-[#0F172A] tracking-[0.4em] opacity-30">Aucun accès en attente</p>
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