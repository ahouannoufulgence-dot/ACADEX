"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRoleFromId } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [role, setRole] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("acadex_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(getRoleFromId(user.id));
    }
  }, []);

  if (!role) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#1F2937] mb-2 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 font-medium">Bienvenue sur votre espace personnel ACADEX.</p>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {role === 'DIRECTOR' && (
            <>
              <StatCard title="Effectif Total" value="842" subtitle="+12% vs année préc." icon={Users} status="positive" />
              <StatCard title="Enseignants" value="48" subtitle="Taux de présence 96%" icon={GraduationCap} status="neutral" />
              <StatCard title="Paiements" value="72%" subtitle="Frais de scolarité à jour" icon={CreditCard} status="positive" />
              <StatCard title="Performance" value="12.4" subtitle="Moyenne générale école" icon={TrendingUp} status="neutral" />
            </>
          )}

          {role === 'TEACHER' && (
            <>
              <StatCard title="Mes Classes" value="4" subtitle="6ème D, 3ème A, 1ère C, Tle D" icon={Users} status="neutral" />
              <StatCard title="Copies à corriger" value="124" subtitle="3 évaluations en attente" icon={FileText} status="warning" />
              <StatCard title="Moyenne Section" value="11.8" subtitle="+0.5 vs trimestre 1" icon={TrendingUp} status="positive" />
              <StatCard title="Absences" value="3%" subtitle="Ce mois-ci" icon={Clock} status="neutral" />
            </>
          )}

          {role === 'STUDENT_PARENT' && (
            <>
              <StatCard title="Moyenne G." value="14.85" subtitle="Rang: 4ème / 42" icon={TrendingUp} status="positive" />
              <StatCard title="Absences" value="2" subtitle="Justifiées: 2, Injustifiées: 0" icon={Clock} status="neutral" />
              <StatCard title="Paiements" value="Solde: 0" subtitle="Statut: Entièrement payé" icon={CreditCard} status="positive" />
              <StatCard title="Devoirs" value="3" subtitle="Agenda de la semaine" icon={FileText} status="neutral" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-[#1F2937] text-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#1A6B4A]" />
                  Informations de l'établissement
                </CardTitle>
                <CardDescription>Mises à jour et alertes récentes</CardDescription>
              </div>
              <button className="text-xs font-bold text-[#1A6B4A] hover:underline flex items-center gap-1">
                Voir tout <ChevronRight className="w-3 h-3" />
              </button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <AlertItem type="warning" title="Conseil de classe Trimestre 2" date="Vendredi 15 Mars" />
              <AlertItem type="info" title="Mise à jour des coefficients de Physique" date="Hier" />
              <AlertItem type="success" title="Publication des bulletins du T1" date="Il y a 2 jours" />
              <AlertItem type="info" title="Réunion parents-profs - Classes de 3ème" date="Lundi prochain" />
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1F2937] text-lg">
                <Clock className="w-5 h-5 text-slate-400" />
                Actions récentes
              </CardTitle>
              <CardDescription>Journal d'activité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <JournalEntry author="Directeur" action="Ajout élève" module="Élèves" time="10:15" />
                <JournalEntry author="M. Kossou" action="Saisie notes MATH" module="Notes" time="09:42" />
                <JournalEntry author="Vous" action="Connexion réussie" module="Sécurité" time="08:00" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, status }: any) {
  return (
    <Card className="premium-card hover:translate-y-[-4px]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">{title}</p>
            <h3 className={cn(
              "text-3xl font-headline font-bold mb-2",
              status === "positive" ? "text-[#1A6B4A]" : "text-[#1F2937]"
            )}>{value}</h3>
            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            status === "positive" ? "bg-[#1A6B4A]/10 text-[#1A6B4A]" : 
            status === "warning" ? "bg-red-100 text-[#DC2626]" : "bg-slate-100 text-slate-500"
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ type, title, date }: any) {
  const iconMap = {
    warning: AlertCircle,
    info: Clock,
    success: CheckCircle2
  };
  const colorMap = {
    warning: "text-[#DC2626] bg-red-50",
    info: "text-blue-500 bg-blue-50",
    success: "text-[#1A6B4A] bg-green-50"
  };
  const Icon = (iconMap as any)[type];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-[#F5F7F9] transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", (colorMap as any)[type])}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1F2937]">{title}</p>
          <p className="text-xs text-slate-400 font-medium">{date}</p>
        </div>
      </div>
    </div>
  );
}

function JournalEntry({ author, action, module, time }: any) {
  return (
    <div className="relative pl-6 pb-6 border-l border-slate-100 last:pb-0">
      <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-[#1A6B4A]" />
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-[#1F2937]">{author}</p>
        <span className="text-[10px] text-slate-400 font-bold">{time}</span>
      </div>
      <p className="text-xs text-slate-500">{action} dans <span className="text-[#1A6B4A] font-bold">{module}</span></p>
    </div>
  );
}
