
"use client";

import React, { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  MoreVertical, 
  GraduationCap, 
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";

export default function TeachersPage() {
  const db = useFirestore();

  const schoolConfigRef = useMemo(() => (db ? doc(db, "config", "school") : null), [db]);
  const { data: schoolConfig } = useDoc(schoolConfigRef);

  const teachersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), where("role", "==", "TEACHER"));
  }, [db]);

  const { data: teachers, loading } = useCollection(teachersQuery);

  const sortedTeachers = useMemo(() => {
    if (!teachers) return [];
    return [...teachers].sort((a: any, b: any) => {
      const nameA = `${a.lastName || a.name || ""} ${a.firstName || ""}`.toLowerCase().trim();
      const nameB = `${b.lastName || b.name || ""} ${b.firstName || ""}`.toLowerCase().trim();
      return nameA.localeCompare(nameB);
    });
  }, [teachers]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Vivid & Dynamic */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">
              Corps Enseignant
            </h1>
            <p className="text-[#0F172A] text-[9px] md:text-2xl font-black opacity-80 uppercase tracking-[0.4em] leading-none">
              {schoolConfig?.name || "ACADEX"} • Session 2026-2027
            </p>
          </div>
          
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl shadow-xl transition-all flex gap-2 text-[10px] md:text-base border-4 border-white/10 uppercase tracking-tighter w-full md:w-auto">
            <UserPlus className="w-4 h-4 md:w-6 md:h-6" /> Nouveau Profil
          </Button>
        </div>

        {/* Stats Row - Compact Cadrans */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="vivid-box bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary rotate-3">
                <Users className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <Badge className="bg-primary text-white text-[6px] md:text-[9px] font-black uppercase tracking-widest px-2">ACTIF</Badge>
            </div>
            <div className="space-y-0.5">
               <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Effectif Profs</p>
               <h3 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">{sortedTeachers.length}</h3>
            </div>
          </div>
          <div className="vivid-box bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between shadow-xl">
             <div className="flex justify-between items-start mb-4">
               <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary -rotate-3">
                 <BookOpen className="w-4 h-4 md:w-6 md:h-6" />
               </div>
               <Badge className="bg-accent text-white text-[6px] md:text-[9px] font-black uppercase tracking-widest px-2">ELITE</Badge>
             </div>
             <div className="space-y-0.5">
                <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Disciplines</p>
                <h3 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">--</h3>
             </div>
          </div>
        </div>

        {/* Search & Action Bar */}
        <Card className="vivid-box border-none shadow-2xl bg-white/95 rounded-[2rem] p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="RECHERCHER UN ENSEIGNANT..." 
                className="pl-12 h-11 md:h-14 bg-slate-50 border-4 border-slate-100 rounded-xl md:rounded-2xl font-black text-[10px] md:text-lg text-[#0F172A] uppercase tracking-widest placeholder:opacity-30 focus-visible:ring-0"
              />
            </div>
          </div>
        </Card>

        {/* Content - Desktop Table / Mobile Cards */}
        <div className="space-y-4">
          <div className="hidden lg:block overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="border-none h-16">
                  <TableHead className="text-white font-black pl-10 text-[10px] uppercase tracking-widest">Enseignant</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest text-center">Spécialité</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest text-center">Statut</TableHead>
                  <TableHead className="text-right pr-10 text-white font-black text-[10px] uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white/95 backdrop-blur-xl">
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="py-20 text-center"><Sparkles className="w-10 h-10 animate-pulse text-primary mx-auto" /></TableCell></TableRow>
                ) : sortedTeachers.map((t: any) => (
                  <TableRow key={t.id} className="hover:bg-primary/5 transition-all border-slate-50 group">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform">
                          {(t.lastName?.[0] || t.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-[#0F172A] text-lg tracking-tighter uppercase leading-none">
                            {t.lastName ? t.lastName.toUpperCase() : t.name} {t.firstName || ""}
                          </p>
                          <p className="text-[9px] font-black font-mono text-primary opacity-60 mt-1 uppercase tracking-widest">{t.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-6">
                      <Badge variant="outline" className="border-2 border-slate-100 bg-slate-50 text-[#0F172A] font-black px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest">
                        {t.subject || "NON DÉFINI"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-6">
                       <div className="flex items-center justify-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", t.status === "Inactif" ? "bg-red-500" : "bg-accent")} />
                          <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">{t.status || "Actif"}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-10 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl"><Mail className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl"><Phone className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Grid - Micro Cadrans */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center"><Sparkles className="w-8 h-8 animate-pulse text-primary" /></div>
            ) : sortedTeachers.map((t: any) => (
              <Card key={t.id} className="vivid-box border-none shadow-xl bg-white p-3 rounded-[1.5rem] flex flex-col justify-between group transition-all active:scale-95">
                <div className="flex justify-between items-start mb-3">
                   <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm shadow-md">
                     {t.lastName?.[0] || "?"}
                   </div>
                   <div className={cn("w-1.5 h-1.5 rounded-full mt-1", t.status === "Inactif" ? "bg-red-500" : "bg-accent")} />
                </div>
                <div className="space-y-0.5 mb-3 overflow-hidden">
                   <p className="text-[10px] font-black text-[#0F172A] uppercase tracking-tighter truncate leading-none">
                     {t.lastName ? t.lastName.toUpperCase() : t.name}
                   </p>
                   <p className="text-[6px] font-black text-primary opacity-60 uppercase tracking-widest">{t.subject || "GENERAL"}</p>
                </div>
                <div className="flex gap-1.5 border-t-2 border-slate-50 pt-2">
                   <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-primary rounded-md"><Mail className="h-3 w-3" /></Button>
                   <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-primary rounded-md"><Phone className="h-3 w-3" /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
