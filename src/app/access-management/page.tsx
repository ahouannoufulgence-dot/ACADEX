
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

  const exportAccessPDF = () => {
    if (!students || students.length === 0) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("LISTE DES CODES D'ACCES ELEVES - ACADEX", 14, 20);
    
    const tableData = students.map(s => [
      s.id,
      s.gradeLevel,
      "En attente"
    ]);

    (doc as any).autoTable({
      head: [['IDENTIFIANT ACCÈS', 'CLASSE', 'ÉTAT']],
      body: tableData,
      startY: 30,
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontStyle: "bold" }
    });

    doc.save("ACADEX_CODES_ACCES.pdf");
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
      description: "Le code d'accès a été retiré." 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Identifiant copié." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Gestion des Accès</h1>
            <p className="text-[#0F172A] text-[10px] md:text-xl font-black opacity-80 uppercase tracking-[0.3em]">Provisionnement Élite</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={exportAccessPDF}
              variant="outline"
              className="bg-white/90 border-2 border-white text-[#0F172A] font-black h-12 md:h-14 px-4 md:px-6 rounded-xl shadow-xl hover:bg-slate-50 flex gap-2 text-[10px] md:text-sm backdrop-blur-xl flex-1 md:flex-none"
            >
              <FileDown className="w-4 h-4 md:w-5 md:h-5" /> <span className="uppercase tracking-tighter">PDF</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-14 px-4 md:px-6 rounded-xl shadow-xl transition-all flex gap-2 text-[10px] md:text-sm border-2 border-white/10 uppercase tracking-tighter flex-1 md:flex-none">
                  <Users className="w-4 h-4 md:w-5 md:h-5" /> <span className="uppercase">Nouveau</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="vivid-box border-none sm:max-w-[400px] p-0 overflow-hidden bg-white shadow-2xl rounded-[2rem]">
                <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-lg shrink-0 rotate-3">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-lg md:text-xl font-black tracking-tighter uppercase leading-none">Génération par Lot</DialogTitle>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-4 bg-white">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-1">Niveau (Ex: 3EME A)</label>
                    <input 
                      placeholder="3EME A"
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-base text-[#0F172A] px-4 outline-none focus:border-primary/40 shadow-inner" 
                      value={bulkData.gradeLevel}
                      onChange={(e) => setBulkData({...bulkData, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-1">Nombre d'élèves</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-xl text-primary px-4 outline-none text-center shadow-inner" 
                      value={bulkData.count}
                      onChange={(e) => setBulkData({...bulkData, count: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-white">
                  <Button 
                    className="bg-primary text-white hover:bg-slate-900 font-black w-full h-14 rounded-xl shadow-xl text-sm md:text-base uppercase border-2 border-white/10" 
                    onClick={handleBulkGenerate} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Générer les accès"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Small Quadrants Grid */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-[9px] md:text-[11px] font-black text-[#0F172A] uppercase tracking-[0.4em] px-2 text-left">Identifiants Actifs</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-primary mb-4" />
              <p className="text-[#0F172A] font-black uppercase tracking-[0.3em] text-[9px] md:text-sm">Lecture du registre...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {students?.map((u: any) => (
                <Card key={u.id} className="vivid-box border-none shadow-xl bg-white/95 p-3 md:p-5 group relative overflow-hidden transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 rotate-3 border border-primary/5 shadow-md">
                      <KeyRound className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    </div>
                    <Badge className="bg-primary text-white text-[6px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 md:py-1 uppercase tracking-widest border-none shadow-md">
                      {u.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">ID</p>
                    <p className="text-[10px] md:text-base font-mono font-black text-[#0F172A] tracking-tighter uppercase truncate leading-none">{u.id}</p>
                  </div>
                  
                  <div className="mt-3 md:mt-5 flex items-center justify-between border-t border-slate-100 pt-3 md:pt-4">
                    <span className="text-[8px] md:text-sm font-black text-[#0F172A] uppercase tracking-tighter truncate opacity-80">{u.gradeLevel}</span>
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 md:h-8 md:w-8 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/5 transition-all"
                        onClick={() => copyToClipboard(u.id)}
                      >
                        <Copy className="h-3 w-3 md:h-4 md:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 md:h-8 md:w-8 rounded-lg text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-all"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {(students?.length === 0 || !students) && !loading && (
                <div className="col-span-full p-16 md:p-24 text-center bg-white/40 rounded-[2rem] border-4 border-dashed border-white shadow-inner backdrop-blur-xl">
                  <p className="text-xs md:text-xl font-black text-slate-400 uppercase tracking-[0.3em] opacity-30">Registre Vierge</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
