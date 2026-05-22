
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Award, 
  Sparkles, 
  BrainCircuit, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileSearch
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeStudentPerformance, PedagogicalAnalysisOutput } from "@/ai/flows/pedagogical-analysis-flow";
import { useToast } from "@/hooks/use-toast";

export default function MyGradesPage() {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<PedagogicalAnalysisOutput | null>(null);

  // No mock grades for a fresh start in 2026-2027
  const grades: any[] = [];
  const generalAvg = 0;

  const handleAiAnalysis = async () => {
    if (grades.length === 0) {
      toast({
        title: "Pas de notes",
        description: "L'IA ne peut pas analyser un relevé vide."
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await analyzeStudentPerformance({
        studentName: "Élève ACADEX",
        gradeLevel: "N/A",
        overallAverage: generalAvg,
        grades: grades.map(g => ({
          subject: g.subject,
          value: g.note,
          coefficient: g.coeff,
          classAverage: g.avg
        }))
      });
      setAiAnalysis(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analyse impossible",
        description: "L'IA pédagogique est momentanément indisponible."
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase">Mon Relevé de Notes</h1>
            <p className="text-primary text-lg font-black uppercase tracking-widest opacity-60">Trimestre 1 • Session 2026-2027</p>
          </div>
          <Card className="vivid-box p-1 flex items-center border-none bg-white/95 shadow-2xl rounded-[2rem]">
            <div className="px-8 py-5 border-r border-slate-50 flex flex-col items-center">
              <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest">Moyenne</p>
              <p className="text-4xl font-headline font-black text-slate-200 tracking-tighter">--</p>
            </div>
            <div className="px-8 py-5 flex flex-col items-center">
              <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest">Mention</p>
              <Badge variant="outline" className="text-slate-200 font-black h-7 px-4 rounded-lg text-[9px] uppercase tracking-widest border-2 border-slate-50">En attente</Badge>
            </div>
          </Card>
        </div>

        {/* AI Pedagogical Advisor Section - Empty state */}
        <Card className="vivid-box bg-white/40 border-dashed border-4 border-white shadow-inner rounded-[3rem]">
          <CardContent className="p-12 md:p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-6 rounded-[2rem] bg-white shadow-xl border-4 border-slate-50 rotate-3">
              <BrainCircuit className="w-10 h-10 md:w-14 md:h-14 text-slate-100" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl md:text-3xl font-black text-slate-400 uppercase tracking-tighter">Conseiller IA ACADEX</h3>
              <p className="text-slate-400 font-black mt-4 text-sm md:text-lg leading-relaxed uppercase tracking-widest opacity-60">
                Le conseiller IA sera disponible dès que vos premières notes seront publiées par vos enseignants pour la session 2026-2027.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grades Table - Empty state */}
        <Card className="vivid-box border-none shadow-2xl rounded-[2.5rem] bg-white/95">
          <CardHeader className="p-8 md:p-10 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border-2 border-primary/5 shadow-inner">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter uppercase">Détails des Évaluations</CardTitle>
                <CardDescription className="text-sm md:text-lg font-black text-primary opacity-60 uppercase tracking-widest">Performance détaillée Trimestre 1.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-20 flex flex-col items-center justify-center text-slate-200 space-y-4">
            <FileSearch className="w-16 h-16 opacity-10" />
            <p className="text-lg font-black uppercase tracking-widest opacity-30">Aucun résultat trouvé.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
