"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KeyRound, ShieldCheck, Users, Copy, Trash2, Loader2, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, serverTimestamp, writeBatch, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { cn } from "@/lib/utils";

export default function AccessManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [bulkData, setBulkData] = useState({
    gradeLevel: "",
    count: 1
  });

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

    // Spontané : pas de await direct ici pour réactivité
    batch.commit()
      .then(() => {
        toast({
          title: "Génération réussie",
          description: `${bulkData.count} accès créés spontanément.`
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

  const exportAccessPDF = () => {
    if (!students || students.length === 0) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("LISTE DES CODES D'ACCES ELEVES - ACADEX 2026-2027", 14, 20);
    
    const tableData = students.map(s => [
      s.id,
      s.gradeLevel,
      "Actif"
    ]);

    (doc as any).autoTable({
      head: [['IDENTIFIANT ACCÈS', 'CLASSE', 'ÉTAT']],
      body: tableData,
      startY: 30,
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontStyle: "bold" }
    });

    doc.save("ACADEX_CODES_ACCES_2026_2027.pdf");
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    
    // Spontané
    deleteDoc(doc(db, "students", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `students/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    toast({ 
      title: "Suppression spontanée", 
      description: "Le code d'accès a été retiré du registre." 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Identifiant prêt pour envoi." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Adaptive & Bold */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Accès Élite</h1>
            <p className="text-[#0F172A] text-[9px] md:text-2xl font-black opacity-80 uppercase tracking-[0.4em] leading-none">Session 2026-2027</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={exportAccessPDF}
              variant="outline"
              className="bg-white/90 border-2 border-slate-100 text-[#0F172A] font-black h-12 md:h-16 px-4 md:px-8 rounded-xl shadow-xl hover:bg-slate-50 flex gap-2 text-[10px] md:text-base backdrop-blur-xl flex-1 md:flex-none uppercase tracking-tighter"
            >
              <FileDown className="w-4 h-4 md:w-6 md:h-6" /> PDF
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-4 md:px-8 rounded-xl shadow-xl transition-all flex gap-2 text-[10px] md:text-base border-4 border-white/10 uppercase tracking-tighter flex-1 md:flex-none">
                  <Users className="w-4 h-4 md:w-6 md:h-6" /> Nouveau
                </Button>
              </DialogTrigger>
              <DialogContent className="vivid-box border-none p-0 overflow-hidden bg-white shadow-2xl sm:max-w-[420px] rounded-[2.5rem]">
                <DialogHeader className="p-6 md:p-8 bg-primary text-white border-b-4 border-accent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0 rotate-3">
                      <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                    <DialogTitle className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Provisionnement Lot</DialogTitle>
                  </div>
                </DialogHeader>

                <div className="p-6 md:p-8 space-y-6 bg-white">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[11px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-1">Classe de référence</label>
                    <input 
                      placeholder="Ex: 3EME A"
                      className="w-full bg-slate-50 border-4 border-slate-100 h-14 md:h-16 rounded-2xl font-black text-lg md:text-2xl text-[#0F172A] px-6 outline-none focus:border-primary/40 shadow-inner placeholder:opacity-30" 
                      value={bulkData.gradeLevel}
                      onChange={(e) => setBulkData({...bulkData, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[11px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-1">Nombre d'identifiants</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border-4 border-slate-100 h-14 md:h-16 rounded-2xl font-black text-2xl md:text-4xl text-primary px-6 outline-none text-center shadow-inner" 
                      value={bulkData.count}
                      onChange={(e) => setBulkData({...bulkData, count: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 md:p-8 pt-0 bg-white">
                  <Button 
                    className="bg-primary text-white hover:bg-slate-900 font-black w-full h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl text-sm md:text-xl uppercase border-4 border-white/10" 
                    onClick={handleBulkGenerate} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : "Générer Spontanément"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Small Quadrants Grid for Mobile (2 columns) and Desktop (5 columns) */}
        <div className="space-y-4 md:space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-[9px] md:text-[14px] font-black text-[#0F172A] uppercase tracking-[0.5em]">Identifiants Actifs</h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 md:w-16 md:h-16 animate-spin text-primary mb-6" />
              <p className="text-[#0F172A] font-black uppercase tracking-[0.4em] text-[8px] md:text-base">Lecture sécurisée...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-8">
              {students?.map((u: any) => (
                <Card key={u.id} className="vivid-box border-none shadow-2xl bg-white/95 p-3 md:p-6 group relative overflow-hidden transition-all hover:scale-[1.05] hover:rotate-1 rounded-[1.5rem] md:rounded-[2.5rem]">
                  <div className="flex justify-between items-start mb-3 md:mb-6">
                    <div className="p-2 md:p-3 bg-primary/10 rounded-xl text-primary shrink-0 rotate-6 border-2 border-primary/5 shadow-md">
                      <KeyRound className="w-3.5 h-3.5 md:w-6 md:h-6" />
                    </div>
                    <Badge className="bg-primary text-white text-[6px] md:text-[9px] font-black px-1.5 md:px-3 py-0.5 md:py-1.5 uppercase tracking-widest border-none shadow-lg">
                      PRÊT
                    </Badge>
                  </div>
                  
                  <div className="space-y-0.5 md:space-y-2">
                    <p className="text-[6px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">ID Personnel</p>
                    <p className="text-[10px] md:text-xl font-mono font-black text-[#0F172A] tracking-tighter uppercase truncate leading-none">{u.id}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-8 flex items-center justify-between border-t-2 border-slate-50 pt-3 md:pt-6">
                    <span className="text-[8px] md:text-base font-black text-primary uppercase tracking-tighter truncate leading-none">{u.gradeLevel}</span>
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 md:h-10 md:w-10 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-all"
                        onClick={() => copyToClipboard(u.id)}
                      >
                        <Copy className="h-3.5 w-3.5 md:h-5 md:w-5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 md:h-10 md:w-10 rounded-xl text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-all"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {(students?.length === 0 || !students) && !loading && (
                <div className="col-span-full p-20 md:p-40 text-center bg-white/30 rounded-[3rem] border-4 border-dashed border-white shadow-inner backdrop-blur-2xl">
                   <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                    <KeyRound className="w-8 h-8 md:w-12 md:h-12 text-slate-400" />
                   </div>
                  <p className="text-xs md:text-2xl font-black text-slate-400 uppercase tracking-[0.5em] opacity-30">Registre Vierge 2026-2027</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
