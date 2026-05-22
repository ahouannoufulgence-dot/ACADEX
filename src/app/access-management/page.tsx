
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
        {/* Header - Optimized for Mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase">Gestion des Accès</h1>
            <p className="text-[#0F172A] text-sm md:text-2xl font-black opacity-80 uppercase tracking-widest">Provisionnement Élite</p>
          </div>
          
          <div className="grid grid-cols-1 sm:flex gap-3 w-full md:w-auto">
            <Button 
              onClick={exportAccessPDF}
              variant="outline"
              className="bg-white border-2 border-slate-100 text-[#0F172A] font-black h-12 md:h-16 px-6 rounded-xl shadow-lg hover:bg-slate-50 flex gap-2 text-xs md:text-lg"
            >
              <FileDown className="w-4 h-4 md:w-6 md:h-6" /> <span className="uppercase">Exporter PDF</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 rounded-xl shadow-lg transition-all flex gap-2 text-xs md:text-lg border-2 border-white/10">
                  <Users className="w-4 h-4 md:w-6 md:h-6" /> <span className="uppercase">Provisionner Classe</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="vivid-box border-none sm:max-w-[500px] p-0 overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="p-8 bg-primary text-white border-b-4 border-accent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-lg shrink-0">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter uppercase">Génération par Lot</DialogTitle>
                  </div>
                </DialogHeader>

                <div className="p-8 space-y-6 bg-white">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em] ml-2">Niveau (Ex: 3EME A)</label>
                    <input 
                      placeholder="3EME A"
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-[#0F172A] px-4 outline-none focus:border-primary/30" 
                      value={bulkData.gradeLevel}
                      onChange={(e) => setBulkData({...bulkData, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em] ml-2">Nombre d'élèves</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-[#0F172A] px-4 outline-none text-center" 
                      value={bulkData.count}
                      onChange={(e) => setBulkData({...bulkData, count: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <DialogFooter className="p-8 pt-0 bg-white">
                  <Button 
                    className="bg-primary text-white hover:bg-slate-900 font-black w-full h-14 md:h-16 rounded-xl shadow-lg text-sm md:text-lg uppercase border-2 border-white/10" 
                    onClick={handleBulkGenerate} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : "Générer les accès"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Access Cards Grid - Small Quadrants for Mobile */}
        <div className="space-y-4">
          <h2 className="text-[10px] md:text-sm font-black text-[#0F172A] uppercase tracking-[0.4em] px-2">Identifiants Actifs</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 md:py-48">
              <Loader2 className="w-12 h-12 md:w-20 md:h-20 animate-spin text-primary mb-6" />
              <p className="text-[#0F172A] font-black uppercase tracking-[0.3em] text-xs md:text-xl">Lecture du registre...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {students?.map((u: any) => (
                <Card key={u.id} className="vivid-box border-none shadow-xl bg-white p-4 md:p-6 group relative overflow-hidden transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 md:p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                      <KeyRound className="w-5 h-5 md:w-7 md:h-7" />
                    </div>
                    <Badge className="bg-primary text-white text-[8px] md:text-[10px] font-black px-2 md:px-4 py-1 uppercase tracking-widest border-none">
                      {u.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Personnel</p>
                    <p className="text-xl md:text-3xl font-mono font-black text-[#0F172A] tracking-tighter uppercase">{u.id}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-xs md:text-lg font-black text-[#0F172A] uppercase tracking-tighter">{u.gradeLevel}</span>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 md:h-10 md:w-10 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        onClick={() => copyToClipboard(u.id)}
                      >
                        <Copy className="h-4 w-4 md:h-5 md:h-5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 md:h-10 md:w-10 rounded-lg text-slate-400 hover:text-destructive transition-colors"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {(students?.length === 0 || !students) && !loading && (
                <div className="col-span-full p-20 text-center bg-white/50 rounded-[2rem] border-4 border-dashed border-slate-100">
                  <p className="text-xl md:text-2xl font-black text-slate-300 uppercase tracking-widest">Aucun identifiant en attente</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
