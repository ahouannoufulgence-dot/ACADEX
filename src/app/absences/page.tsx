"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, Search, Calendar, FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getRoleFromId } from "@/lib/auth-utils";

export default function AbsencesPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("acadex_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      setRole(getRoleFromId(u.id));
    }
  }, []);

  const allAbsences = [
    { student: "Dossou Marc", class: "6ème D", date: "12/03/2024", duration: "2h", status: "Justifié", reason: "Maladie" },
    { student: "Koffi Amé", class: "3ème A", date: "11/03/2024", duration: "1 journée", status: "Non Justifié", reason: "-" },
    { student: "Sika Marielle", class: "Tle D", date: "10/03/2024", duration: "4h", status: "Justifié", reason: "Compétition" },
    { student: "Dossou Marc", class: "6ème D", date: "05/03/2024", duration: "1h", status: "Justifié", reason: "Rendez-vous" },
  ];

  if (!mounted) return null;

  // Filtrage : Si c'est un élève/parent, il ne voit que ses propres absences
  const filteredAbsences = role === 'STUDENT_PARENT' 
    ? allAbsences.filter(a => a.student === user?.name || user?.name?.includes(a.student))
    : allAbsences;

  const isStaff = role === 'DIRECTOR' || role === 'TEACHER';

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#111827] mb-2">
              {isStaff ? "Suivi des Absences" : "Mon Suivi des Présences"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isStaff ? "Registre global des présences et retards de l'établissement." : "Consultez l'historique de vos absences et justificatifs."}
            </p>
          </div>
          <Button className={cn(
            "font-bold h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95",
            isStaff ? "bg-[#B91C1C] hover:bg-[#991B1B] text-white" : "bg-[#14532D] hover:bg-[#166534] text-white"
          )}>
            {isStaff ? (
              <><ShieldAlert className="w-4 h-4 mr-2" /> Signaler une absence</>
            ) : (
              <><FileCheck className="w-4 h-4 mr-2" /> Justifier une absence</>
            )}
          </Button>
        </div>

        {!isStaff && filteredAbsences.length === 0 && (
          <div className="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <CheckCircle className="w-16 h-16 text-[#16A34A] mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold text-[#111827]">Félicitations, {user?.name} !</p>
            <p className="text-slate-500">Aucune absence enregistrée pour le moment.</p>
          </div>
        )}

        {(isStaff || filteredAbsences.length > 0) && (
          <Card className="premium-card border-none shadow-xl">
            <CardHeader className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder={isStaff ? "Rechercher un élève..." : "Rechercher une date..."} 
                    className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl" 
                  />
                </div>
                <Button variant="outline" className="border-slate-200 text-slate-600 h-11 px-6 rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" /> Mars 2024
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100">
                      {isStaff && <TableHead className="text-[#111827] font-bold">Élève</TableHead>}
                      <TableHead className="text-[#111827] font-bold">Date</TableHead>
                      <TableHead className="text-[#111827] font-bold">Durée</TableHead>
                      <TableHead className="text-[#111827] font-bold">Statut</TableHead>
                      <TableHead className="text-right text-[#111827] font-bold">Motif</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAbsences.map((a, i) => (
                      <TableRow key={i} className="hover:bg-slate-50 transition-colors border-slate-50">
                        {isStaff && <TableCell className="font-bold text-[#111827]">{a.student}</TableCell>}
                        <TableCell className="text-slate-600 font-medium">{a.date}</TableCell>
                        <TableCell className="text-slate-600">{a.duration}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-bold h-6 px-3 uppercase tracking-wider",
                            a.status === "Justifié" 
                              ? "bg-green-50 text-[#14532D] border-green-100" 
                              : "bg-red-50 text-[#B91C1C] border-red-100 animate-pulse"
                          )} variant="outline">
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500 italic">{a.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {!isStaff && (
                <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-start">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Note importante :</strong> Toute absence doit être justifiée dans les 48 heures suivant le retour en classe par la présentation d'un certificat médical ou d'un motif valable à la Direction.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function CheckCircle({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
