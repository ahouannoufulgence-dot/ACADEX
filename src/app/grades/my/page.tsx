
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

  // No mock grades for a fresh start
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
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Mon Relevé de Notes</h1>
            <p className="text-slate-500 text-lg font-medium">Trimestre 1 • Session 2023 / 2024</p>
          </div>
          <Card className="premium-card p-2 flex items-center border-none bg-white shadow-2xl">
            <div className="px-10 py-6 border-r border-slate-100 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Moyenne Générale</p>
              <p className="text-5xl font-headline font-bold text-slate-300">--</p>
            </div>
            <div className="px-10 py-6 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Mention</p>
              <Badge variant="outline" className="text-slate-300 font-bold h-8 px-6 rounded-xl text-xs uppercase tracking-widest">À venir</Badge>
            </div>
          </Card>
        </div>

        {/* AI Pedagogical Advisor Section - Empty state */}
        <Card className="premium-card bg-slate-50 border-dashed border-2 border-slate-200">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-6 rounded-full bg-white shadow-xl">
              <BrainCircuit className="w-12 h-12 text-slate-200" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-slate-400">Conseiller IA ACADEX</h3>
              <p className="text-slate-400 font-medium mt-2">
                Le conseiller IA sera disponible dès que vos premières notes seront publiées par vos enseignants.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grades Table - Empty state */}
        <Card className="premium-card">
          <CardHeader className="p-10 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent/10">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Détails des Évaluations</CardTitle>
                <CardDescription className="text-lg">Performance détaillée par matière pour le Trimestre 1.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <FileSearch className="w-16 h-16 opacity-10" />
            <p className="text-lg font-bold">Aucune note enregistrée pour le moment.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
