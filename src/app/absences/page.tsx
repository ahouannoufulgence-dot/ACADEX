
"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, Search, Calendar, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
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

  // No mock absences for a fresh start
  const allAbsences: any[] = [];

  if (!mounted) return null;

  const filteredAbsences = allAbsences;
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
              {isStaff ? "Registre global des présences et retards." : "Consultez l'historique de vos présences."}
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

        <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#16A34A] opacity-30" />
          </div>
          <p className="text-2xl font-bold text-[#111827]">Registre Vierge</p>
          <p className="text-slate-400 mt-2">Aucune absence n'a été signalée pour ce début de trimestre.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
