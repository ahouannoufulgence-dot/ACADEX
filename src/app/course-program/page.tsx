"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  BookMarked, 
  ArrowRight,
  Edit3,
  Trash2,
  Save,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  title: string;
  status: "À venir" | "En cours" | "Terminé";
  progress: number;
  class: string;
}

export default function CourseProgramPage() {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "Introduction aux Matrices", status: "Terminé", progress: 100, class: "TLE D" },
    { id: "2", title: "Probabilités Conditionnelles", status: "En cours", progress: 65, class: "TLE D" },
    { id: "3", title: "Suites Numériques", status: "À venir", progress: 0, class: "3EME A" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: "", class: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    // Spontané : Mise à jour instantanée de l'état local
    setChapters(prev => prev.map(ch => {
      if (ch.id === id) {
        let nextStatus: Chapter["status"] = "À venir";
        let nextProgress = 0;
        
        if (ch.status === "À venir") { nextStatus = "En cours"; nextProgress = 50; }
        else if (ch.status === "En cours") { nextStatus = "Terminé"; nextProgress = 100; }
        else { nextStatus = "À venir"; nextProgress = 0; }
        
        return { ...ch, status: nextStatus, progress: nextProgress };
      }
      return ch;
    }));
  };

  const handleAddChapter = () => {
    if (!newChapter.title || !newChapter.class) return;
    const id = Math.random().toString(36).substr(2, 9);
    const chapter: Chapter = {
      id,
      title: newChapter.title,
      class: newChapter.class.toUpperCase(),
      status: "À venir",
      progress: 0
    };
    setChapters([chapter, ...chapters]);
    setNewChapter({ title: "", class: "" });
    setIsAdding(false);
    toast({ title: "Chapitre ajouté", description: "Le programme a été mis à jour spontanément." });
  };

  const handleDelete = (id: string) => {
    setChapters(chapters.filter(c => c.id !== id));
    toast({ variant: "destructive", title: "Retiré", description: "Le chapitre a été supprimé du registre." });
  };

  const totalProgress = useMemo(() => {
    if (chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, c) => acc + c.progress, 0);
    return Math.round(sum / chapters.length);
  }, [chapters]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Vivid Elite */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left w-full">
            <h1 className="text-2xl md:text-5xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Programme Pédagogique</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-[0.3em]">Suivi des Chapitres • 2026-2027</p>
          </div>
          
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-slate-900 text-white font-black h-11 md:h-14 px-6 md:px-8 shadow-xl rounded-xl md:rounded-2xl transition-all active:scale-95 border-2 border-white/10 w-full md:w-auto text-[10px] md:text-base uppercase tracking-tighter shrink-0">
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" /> Nouveau Chapitre
              </Button>
            </DialogTrigger>
            <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden rounded-[2rem] sm:max-w-[400px]">
              <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-lg shrink-0 rotate-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <DialogTitle className="text-lg font-black tracking-tighter uppercase">Nouveau Cours</DialogTitle>
                </div>
              </DialogHeader>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Titre du Chapitre</Label>
                  <Input 
                    placeholder="Ex: Équations Différentielles" 
                    className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-[#0F172A]"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Classe</Label>
                  <Input 
                    placeholder="Ex: 3EME A" 
                    className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-[#0F172A]"
                    value={newChapter.class}
                    onChange={(e) => setNewChapter({...newChapter, class: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="p-6 pt-0">
                <Button className="w-full h-14 bg-primary text-white font-black rounded-xl uppercase shadow-lg border-2 border-white/10" onClick={handleAddChapter}>
                  Valider Spontanément
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Global Progress Quadrant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-2">
          <Card className="md:col-span-2 vivid-box border-none bg-primary text-white p-6 md:p-10 shadow-2xl relative overflow-hidden group rounded-[2rem]">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg shadow-lg rotate-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                   </div>
                   <p className="text-[10px] md:text-xl font-black uppercase tracking-[0.3em] text-accent">Avancement Global</p>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <h4 className="text-2xl md:text-6xl font-black tracking-tighter leading-none">{totalProgress}% achevé</h4>
                      <span className="text-[8px] md:text-sm font-black uppercase opacity-60">Trimestre 1</span>
                   </div>
                   <Progress value={totalProgress} className="h-2.5 md:h-4 bg-white/10" />
                </div>
             </div>
             <BookOpen className="absolute right-[-20px] bottom-[-20px] w-24 h-24 md:w-56 md:h-56 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
          </Card>

          <Card className="vivid-box p-6 md:p-10 flex flex-col justify-between shadow-2xl bg-white/95 rounded-[2rem] border-2 border-slate-50">
             <div className="flex justify-between items-start">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner border-2 border-slate-100 rotate-6">
                   <BookMarked className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <Badge className="bg-primary text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1">Élite</Badge>
             </div>
             <div className="mt-4">
                <p className="text-[8px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest">Chapitres restants</p>
                <p className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">
                  {chapters.filter(c => c.status !== "Terminé").length}
                </p>
             </div>
          </Card>
        </div>

        {/* Chapters Micro-Quadrants */}
        <div className="px-2 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-[10px] md:text-xl font-black text-[#0F172A] uppercase tracking-[0.4em]">Registre des Cours</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {chapters.map((ch) => (
              <Card 
                key={ch.id} 
                className="vivid-box border-none shadow-xl bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] group hover:scale-[1.05] transition-all border-b-4 border-slate-100 active:border-primary relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3 md:mb-6">
                   <button 
                    onClick={() => toggleStatus(ch.id)}
                    className={cn(
                     "w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-lg transition-transform hover:rotate-6",
                     ch.status === "Terminé" ? "bg-accent text-white" : ch.status === "En cours" ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                   )}>
                     {ch.status === "Terminé" ? <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Clock className="w-3.5 h-3.5 md:w-5 md:h-5" />}
                   </button>
                   <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md text-slate-300 hover:text-primary hover:bg-primary/5" onClick={() => toast({ title: "Mode édition", description: "Bientôt disponible" })}>
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(ch.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                   </div>
                </div>
                
                <div className="space-y-1 md:space-y-2 mb-3 md:mb-6">
                   <p className="text-[10px] md:text-base font-black text-[#0F172A] uppercase leading-tight tracking-tighter truncate group-hover:text-primary transition-colors">
                     {ch.title}
                   </p>
                   <div className="flex justify-between items-center">
                     <p className="text-[6px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       {ch.status}
                     </p>
                     <Badge variant="outline" className="border-none bg-slate-50 font-black text-[6px] md:text-[8px] uppercase tracking-widest px-1.5 py-0 rounded text-primary">
                       {ch.class}
                     </Badge>
                   </div>
                </div>

                <div className="pt-2 md:pt-4 border-t-2 border-slate-50 flex items-center justify-between">
                   <div className="flex-1 mr-3">
                      <Progress value={ch.progress} className="h-1 md:h-1.5" />
                   </div>
                   <span className="text-[6px] md:text-[9px] font-black text-primary">{ch.progress}%</span>
                </div>
              </Card>
            ))}

            {chapters.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[2rem] border-4 border-dashed border-white shadow-inner">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Aucun chapitre enregistré</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

