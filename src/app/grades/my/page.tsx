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
  Lightbulb
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

  const grades = [
    { subject: "Mathématiques", note: 16.5, avg: 12.4, high: 19, low: 0.5, rank: "3/42", coeff: 4 },
    { subject: "Français", note: 14.0, avg: 11.2, high: 17, low: 4.5, rank: "8/42", coeff: 4 },
    { subject: "Physique-Chimie", note: 18.0, avg: 10.8, high: 20, low: 3.0, rank: "1/42", coeff: 3 },
    { subject: "Anglais", note: 9.5, avg: 13.5, high: 18.5, low: 8, rank: "35/42", coeff: 2 },
    { subject: "SVT", note: 11.5, avg: 10.5, high: 16, low: 6, rank: "12/42", coeff: 2 },
  ];

  const generalAvg = 14.85;

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const result = await analyzeStudentPerformance({
        studentName: "Dossou Marc",
        gradeLevel: "3ème A",
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

  const getNoteColor = (note: number) => {
    if (note >= 14) return "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20";
    if (note >= 10) return "text-[#111827] bg-[#111827]/5 border-[#111827]/10";
    return "text-[#B91C1C] bg-[#B91C1C]/10 border-[#B91C1C]/20";
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Mon Relevé de Notes</h1>
            <p className="text-slate-500 text-lg font-medium">Trimestre 2 • Session 2023 / 2024</p>
          </div>
          <Card className="premium-card p-2 flex items-center border-none bg-white shadow-2xl">
            <div className="px-10 py-6 border-r border-slate-100 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Moyenne Générale</p>
              <p className="text-5xl font-headline font-bold text-[#14532D]">{generalAvg}</p>
            </div>
            <div className="px-10 py-6 flex flex-col items-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Mention</p>
              <Badge className="bg-[#14532D] text-white font-bold h-8 px-6 rounded-xl text-xs uppercase tracking-widest">Bien</Badge>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatMiniCard icon={Trophy} label="Rang dans la classe" value="4ème / 42" color="text-[#14532D]" />
          <StatMiniCard icon={Star} label="Points Cumulés" value="214.50" color="text-[#111827]" />
          <StatMiniCard icon={TrendingUp} label="Progression" value="+1.2 pts" color="text-[#16A34A]" />
        </div>

        {/* AI Pedagogical Advisor Section */}
        <Card className={cn(
          "premium-card border-l-4 border-l-accent transition-all duration-500",
          aiAnalysis ? "bg-white" : "bg-accent/5"
        )}>
          <CardHeader className="p-8 md:p-12 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-accent text-white shadow-lg">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-[#111827]">Conseiller IA ACADEX</CardTitle>
                  <CardDescription className="text-lg">Analyse pédagogique intelligente de vos résultats.</CardDescription>
                </div>
              </div>
              {!aiAnalysis && (
                <Button 
                  onClick={handleAiAnalysis} 
                  disabled={isAiLoading}
                  className="bg-[#14532D] hover:bg-[#166534] text-white font-bold h-14 px-8 rounded-2xl shadow-xl flex gap-3 animate-pulse"
                >
                  {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Lancer l'Analyse IA
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-12 pt-8">
            {aiAnalysis ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-600 text-lg leading-relaxed">
                  "{aiAnalysis.overallAssessment}"
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-[#16A34A] uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5" /> Mes Points Forts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.strengths.map((s, i) => (
                        <Badge key={i} className="bg-green-50 text-[#16A34A] border-green-100 h-8 px-4 font-bold rounded-lg">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-[#B91C1C] uppercase tracking-widest">
                      <AlertCircle className="w-5 h-5" /> À Travailler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.weaknesses.map((w, i) => (
                        <Badge key={i} className="bg-red-50 text-[#B91C1C] border-red-100 h-8 px-4 font-bold rounded-lg">{w}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-[#14532D] text-white space-y-4 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Lightbulb className="w-7 h-7 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">Conseil de l'IA Pédagogique</h4>
                      <p className="text-emerald-50/90 leading-relaxed text-lg">{aiAnalysis.advice}</p>
                    </div>
                  </div>
                  <Sparkles className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/5 rotate-12" />
                </div>
                
                <div className="flex justify-center">
                  <Button variant="ghost" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-accent" onClick={() => setAiAnalysis(null)}>
                    Réinitialiser l'analyse
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                <BrainCircuit className="w-16 h-16 text-slate-300" />
                <p className="text-slate-500 font-medium max-w-sm">
                  Cliquez sur le bouton ci-dessus pour obtenir un bilan détaillé de vos performances et des conseils de réussite.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Grades Table */}
        <Card className="premium-card">
          <CardHeader className="p-10 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent/10">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Détails des Évaluations</CardTitle>
                <CardDescription className="text-lg">Performance détaillée par matière et comparaison avec la classe.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-inner bg-slate-50/20">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[#111827] font-bold h-16 pl-8">Matière</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Note / 20</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Coeff</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Moy. Classe</TableHead>
                    <TableHead className="text-[#111827] font-bold h-16 text-center">Min/Max</TableHead>
                    <TableHead className="text-right text-[#111827] font-bold h-16 pr-8">Rang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-white transition-all duration-200 border-slate-50 group">
                      <TableCell className="font-bold text-[#111827] text-lg py-6 pl-8">{item.subject}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-base font-black w-16 h-10 justify-center border-none shadow-sm rounded-xl", getNoteColor(item.note))}>
                          {item.note}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-500">{item.coeff}</TableCell>
                      <TableCell className="text-center font-bold text-slate-500">{item.avg}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                          <span className="text-[#B91C1C] bg-red-50 px-3 py-1 rounded-lg">{item.low}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-[#16A34A] bg-green-50 px-3 py-1 rounded-lg">{item.high}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black text-[#111827] pr-8 text-xl">{item.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatMiniCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="premium-card p-10 flex items-center gap-8 border-none shadow-xl hover:translate-y-[-6px] transition-transform">
      <div className={cn("p-5 rounded-2xl bg-slate-50 shadow-inner group-hover:bg-white transition-colors", color)}>
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2">{label}</p>
        <p className="text-3xl font-headline font-bold text-[#111827]">{value}</p>
      </div>
    </Card>
  );
}
