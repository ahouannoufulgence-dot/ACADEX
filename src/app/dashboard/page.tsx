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
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRoleFromId } from "@/lib/auth-utils";

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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace personnel ACADEX.</p>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {role === 'DIRECTOR' && (
            <>
              <StatCard title="Effectif Total" value="842" subtitle="+12% vs année préc." icon={Users} color="bg-blue-500" />
              <StatCard title="Enseignants" value="48" subtitle="Taux de présence 96%" icon={GraduationCap} color="bg-primary" />
              <StatCard title="Paiements" value="72%" subtitle="Frais de scolarité à jour" icon={CreditCard} color="bg-accent" />
              <StatCard title="Performance" value="12.4" subtitle="Moyenne générale école" icon={TrendingUp} color="bg-purple-500" />
            </>
          )}

          {role === 'TEACHER' && (
            <>
              <StatCard title="Mes Classes" value="4" subtitle="6ème D, 3ème A, 1ère C, Tle D" icon={Users} color="bg-blue-500" />
              <StatCard title="Copies à corriger" value="124" subtitle="3 évaluations en attente" icon={FileText} color="bg-primary" />
              <StatCard title="Moyenne Section" value="11.8" subtitle="+0.5 vs trimestre 1" icon={TrendingUp} color="bg-accent" />
              <StatCard title="Absences" value="3%" subtitle="Ce mois-ci" icon={Clock} color="bg-purple-500" />
            </>
          )}

          {role === 'STUDENT_PARENT' && (
            <>
              <StatCard title="Moyenne G." value="14.85" subtitle="Rang: 4ème / 42" icon={TrendingUp} color="bg-accent" />
              <StatCard title="Absences" value="2" subtitle="Justifiées: 2, Injustifiées: 0" icon={Clock} color="bg-blue-500" />
              <StatCard title="Paiements" value="Solde: 0" subtitle="Statut: Entièrement payé" icon={CreditCard} color="bg-primary" />
              <StatCard title="Devoirs" value="3" subtitle="Agenda de la semaine" icon={FileText} color="bg-purple-500" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Alertes & Informations importantes
              </CardTitle>
              <CardDescription>Les dernières mises à jour de l'établissement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertItem type="warning" title="Conseil de classe Trimestre 2" date="Vendredi 15 Mars" />
              <AlertItem type="info" title="Mise à jour des coefficients de Physique" date="Hier" />
              <AlertItem type="success" title="Publication des bulletins du T1" date="Il y a 2 jours" />
              <AlertItem type="info" title="Réunion parents-profs - Classes de 3ème" date="Lundi prochain" />
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
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

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <Card className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-headline font-bold text-white mb-2">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn("p-3 rounded-xl shadow-lg shadow-black/20", color)}>
            <Icon className="w-6 h-6 text-white" />
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
    warning: "text-amber-400",
    info: "text-blue-400",
    success: "text-accent"
  };
  const Icon = (iconMap as any)[type];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5", (colorMap as any)[type])} />
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <button className="text-xs font-bold text-accent hover:underline">Voir</button>
    </div>
  );
}

function JournalEntry({ author, action, module, time }: any) {
  return (
    <div className="relative pl-6 pb-6 border-l border-white/10 last:pb-0">
      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-primary" />
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-white">{author}</p>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground">{action} dans <span className="text-accent">{module}</span></p>
    </div>
  );
}