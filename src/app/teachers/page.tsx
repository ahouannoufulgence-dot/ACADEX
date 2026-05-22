
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen,
  Loader2,
  AlertCircle,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function TeachersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ firstName: "", lastName: "", subject: "", status: "" });

  const schoolConfigRef = useMemo(() => (db ? doc(db, "config", "school") : null), [db]);
  const { data: schoolConfig } = useDoc(schoolConfigRef);

  const teachersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), where("role", "==", "TEACHER"));
  }, [db]);

  const { data: teachers, loading } = useCollection(teachersQuery);

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    const q = searchQuery.toLowerCase();
    return [...teachers].filter((t: any) => 
      (t.lastName || "").toLowerCase().includes(q) || 
      (t.firstName || "").toLowerCase().includes(q) || 
      (t.name || "").toLowerCase().includes(q) ||
      (t.id || "").toLowerCase().includes(q)
    ).sort((a: any, b: any) => {
      const nameA = `${a.lastName || a.name || ""} ${a.firstName || ""}`.toLowerCase().trim();
      const nameB = `${b.lastName || b.name || ""} ${b.firstName || ""}`.toLowerCase().trim();
      return nameA.localeCompare(nameB);
    });
  }, [teachers, searchQuery]);

  const handleEditClick = (teacher: any) => {
    setEditingTeacher(teacher);
    setEditFormData({
      firstName: teacher.firstName || "",
      lastName: teacher.lastName || teacher.name || "",
      subject: teacher.subject || "",
      status: teacher.status || "Actif"
    });
  };

  const handleUpdate = () => {
    if (!db || !editingTeacher) return;

    const teacherRef = doc(db, "users", editingTeacher.id);
    const updatedData = {
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      name: `M. ${editFormData.lastName}`,
      subject: editFormData.subject,
      status: editFormData.status,
      updatedAt: serverTimestamp()
    };

    // Spontané
    updateDoc(teacherRef, updatedData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: teacherRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ title: "Profil mis à jour", description: `Les modifications pour ${editingTeacher.id} sont effectives.` });
    setEditingTeacher(null);
  };

  const handleDelete = (id: string) => {
    if (!db) return;

    // Spontané
    deleteDoc(doc(db, "users", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `users/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ variant: "destructive", title: "Suppression spontanée", description: "Le compte enseignant a été retiré du registre." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">
              Corps Enseignant
            </h1>
            <p className="text-[#0F172A] text-[9px] md:text-2xl font-black opacity-80 uppercase tracking-[0.4em] leading-none">
              {schoolConfig?.name || "ACADEX"} • Session 2026-2027
            </p>
          </div>
          
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl shadow-xl transition-all flex gap-2 text-[10px] md:text-base border-4 border-white/10 uppercase tracking-tighter w-full md:w-auto">
            <UserPlus className="w-4 h-4 md:w-5 md:h-5" /> Nouveau Profil
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-2">
          <div className="vivid-box bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary rotate-3">
                <Users className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <Badge className="bg-primary text-white text-[6px] md:text-[8px] font-black uppercase tracking-widest px-2">ACTIF</Badge>
            </div>
            <div className="space-y-0.5">
               <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Effectif Profs</p>
               <h3 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">{filteredTeachers.length}</h3>
            </div>
          </div>
          <div className="vivid-box bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between shadow-xl">
             <div className="flex justify-between items-start mb-4">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary -rotate-3">
                 <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
               </div>
               <Badge className="bg-accent text-white text-[6px] md:text-[8px] font-black uppercase tracking-widest px-2">ELITE</Badge>
             </div>
             <div className="space-y-0.5">
                <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Disciplines</p>
                <h3 className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">--</h3>
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-2">
          <Card className="vivid-box border-none shadow-2xl bg-white/95 rounded-[2rem] p-4 md:p-8">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="RECHERCHER UN ENSEIGNANT..." 
                className="pl-12 h-11 md:h-14 bg-slate-50 border-4 border-slate-100 rounded-xl md:rounded-2xl font-black text-[10px] md:text-lg text-[#0F172A] uppercase tracking-widest placeholder:opacity-30 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Desktop Content */}
        <div className="hidden lg:block px-2 overflow-hidden">
          <div className="rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden">
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
                  <TableRow><TableCell colSpan={4} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                ) : filteredTeachers.map((t: any) => (
                  <TableRow key={t.id} className="hover:bg-primary/5 transition-all border-slate-50 group">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform">
                          {(t.lastName?.[0] || t.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-[#0F172A] text-base tracking-tighter uppercase leading-none">
                            {t.lastName ? t.lastName.toUpperCase() : t.name} {t.firstName || ""}
                          </p>
                          <p className="text-[8px] font-black font-mono text-primary opacity-60 mt-1 uppercase tracking-widest">{t.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-6">
                      <Badge variant="outline" className="border-2 border-slate-100 bg-slate-50 text-[#0F172A] font-black px-4 py-1 rounded-xl uppercase text-[9px] tracking-widest">
                        {t.subject || "NON DÉFINI"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-6">
                       <div className="flex items-center justify-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", t.status === "Suspendu" ? "bg-red-500" : "bg-accent")} />
                          <span className="text-[9px] font-black text-[#0F172A] uppercase tracking-widest">{t.status || "Actif"}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-10 py-6">
                      <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/5 rounded-lg" onClick={() => handleEditClick(t)}><Edit3 className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(t.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Content - Micro Cadrans */}
        <div className="grid grid-cols-2 gap-3 lg:hidden px-2 pb-10">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filteredTeachers.map((t: any) => (
            <Card key={t.id} className="vivid-box border-none shadow-xl bg-white p-3 rounded-[1.5rem] flex flex-col justify-between group transition-all active:scale-95">
              <div className="flex justify-between items-start mb-3">
                 <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shadow-md">
                   {t.lastName?.[0] || "?"}
                 </div>
                 <div className={cn("w-1.5 h-1.5 rounded-full mt-1", t.status === "Suspendu" ? "bg-red-500" : "bg-accent")} />
              </div>
              <div className="space-y-0.5 mb-3 overflow-hidden">
                 <p className="text-[9px] font-black text-[#0F172A] uppercase tracking-tighter truncate leading-none">
                   {t.lastName ? t.lastName.toUpperCase() : t.name}
                 </p>
                 <p className="text-[6px] font-black text-primary opacity-60 uppercase tracking-widest">{t.subject || "GENERAL"}</p>
              </div>
              <div className="flex gap-1.5 border-t-2 border-slate-50 pt-2">
                 <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/5 rounded-md" onClick={() => handleEditClick(t)}><Edit3 className="h-3 w-3" /></Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50 rounded-md" onClick={() => handleDelete(t.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
          <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden shadow-2xl sm:max-w-[400px] rounded-[2rem]">
            <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-lg shrink-0 rotate-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black tracking-tighter uppercase">Modifier Profil</DialogTitle>
                  <DialogDescription className="text-white/60 text-[8px] font-black uppercase tracking-widest">Édition stratégique • {editingTeacher?.id}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                  <Input 
                    className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                    value={editFormData.firstName} 
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <Input 
                    className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                    value={editFormData.lastName} 
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière / Discipline</label>
                <Input 
                  className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                  value={editFormData.subject} 
                  onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut Académique</label>
                <Select value={editFormData.status} onValueChange={(val) => setEditFormData({...editFormData, status: val})}>
                  <SelectTrigger className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Membre Actif</SelectItem>
                    <SelectItem value="Suspendu">Accès Suspendu</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="p-8 pt-0">
              <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-14 rounded-2xl shadow-xl transition-all text-xs uppercase border-4 border-white/10" onClick={handleUpdate}>
                <Save className="w-4 h-4 mr-2" /> Appliquer les changements
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

