
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy,
  Check,
  Users,
  BookOpen,
  Loader2,
  Save,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({ title: "Copié !", description: `L'identifiant ${id} est prêt.` });
    setTimeout(() => setCopiedId(null), 2000);
  };

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

    updateDoc(teacherRef, updatedData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: teacherRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ title: "Profil mis à jour", description: "Modifications appliquées spontanément." });
    setEditingTeacher(null);
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "users", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `users/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    toast({ variant: "destructive", title: "Suppression spontanée", description: "Le compte a été retiré." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-10 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left">
            <h1 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">
              Corps Enseignant
            </h1>
            <p className="text-[#0F172A] text-[9px] md:text-xl font-black opacity-80 uppercase tracking-[0.4em] leading-none">
              {schoolConfig?.name || "ACADEX"} • Session 2026-2027
            </p>
          </div>
          
          <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-xl transition-all flex gap-4 text-[10px] md:text-base border-2 border-white/10 uppercase tracking-tighter w-full md:w-auto">
            <UserPlus className="w-7 h-7 md:w-9 md:h-9" /> Nouveau Profil
          </Button>
        </div>

        {/* Stats Mini Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-2">
          <div className="vivid-box bg-white p-5 md:p-8 rounded-[1.5rem] flex flex-col justify-between shadow-xl border-2 border-slate-50">
             <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary rotate-3">
                  <Users className="w-7 h-7" />
                </div>
                <Badge className="bg-primary text-white text-[7px] font-black uppercase tracking-widest px-2.5 h-6 flex items-center">Actifs</Badge>
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Effectif</p>
                <h3 className="text-2xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">{filteredTeachers.length}</h3>
             </div>
          </div>
          <div className="vivid-box bg-white p-5 md:p-8 rounded-[1.5rem] flex flex-col justify-between shadow-xl border-2 border-slate-50">
             <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary -rotate-3">
                  <BookOpen className="w-7 h-7" />
                </div>
                <Badge className="bg-accent text-white text-[7px] font-black uppercase tracking-widest px-2.5 h-6 flex items-center">Elite</Badge>
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Disciplines</p>
                <h3 className="text-2xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-none">--</h3>
             </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-2">
          <Card className="vivid-box border-none shadow-2xl bg-white/95 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8">
            <div className="relative w-full max-w-2xl group">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="RECHERCHER UN ENSEIGNANT OU ID..." 
                className="pl-14 h-12 md:h-14 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-[10px] md:text-lg text-[#0F172A] uppercase tracking-widest placeholder:opacity-30 focus-visible:ring-0 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Desktop Content */}
        <div className="hidden lg:block px-2 overflow-hidden">
          <div className="rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden bg-white/95 backdrop-blur-xl">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="border-none h-16">
                  <TableHead className="text-white font-black pl-10 text-[11px] uppercase tracking-widest">Enseignant & Identifiant</TableHead>
                  <TableHead className="text-white font-black text-[11px] uppercase tracking-widest text-center">Discipline</TableHead>
                  <TableHead className="text-white font-black text-[11px] uppercase tracking-widest text-center">État</TableHead>
                  <TableHead className="text-right pr-10 text-white font-black text-[11px] uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="py-24 text-center"><Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                ) : filteredTeachers.map((t: any) => (
                  <TableRow key={t.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-white/10 shrink-0">
                          {(t.lastName?.[0] || t.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-[#0F172A] text-base uppercase leading-none truncate">
                            {t.lastName ? t.lastName.toUpperCase() : t.name} {t.firstName || ""}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                             <p className="text-[10px] font-black font-mono text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded shadow-sm">{t.id}</p>
                             <button onClick={() => copyToClipboard(t.id)} className="text-slate-300 hover:text-primary transition-colors">
                               {copiedId === t.id ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5" />}
                             </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-6">
                      <Badge variant="outline" className="border-2 border-slate-100 bg-slate-50 text-[#0F172A] font-black px-4 py-1 rounded-lg uppercase text-[10px] tracking-widest shadow-sm">
                        {t.subject || "GENERAL"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-6">
                       <div className="flex items-center justify-center gap-3">
                          <div className={cn("w-3 h-3 rounded-full", t.status === "Suspendu" ? "bg-red-500" : "bg-accent")} />
                          <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">{t.status || "Actif"}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-10 py-6">
                      <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-11 w-11 text-primary hover:bg-primary/5 rounded-xl shadow-sm" onClick={() => handleEditClick(t)}><Edit3 className="w-7 h-7" /></Button>
                        <Button variant="ghost" size="icon" className="h-11 w-11 text-red-500 hover:bg-red-50 rounded-xl shadow-sm" onClick={() => handleDelete(t.id)}><Trash2 className="w-7 h-7" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Content - Micro Cadrans */}
        <div className="grid grid-cols-2 gap-4 lg:hidden px-2 pb-12">
          {loading ? (
            <div className="col-span-full py-24 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : filteredTeachers.map((t: any) => (
            <Card key={t.id} className="vivid-box border-none shadow-xl bg-white p-4 rounded-[1.5rem] flex flex-col justify-between group transition-all active:scale-95 border-2 border-slate-50">
              <div className="flex justify-between items-start mb-3">
                 <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shadow-md">
                   {t.lastName?.[0] || "?"}
                 </div>
                 <button onClick={() => copyToClipboard(t.id)} className="text-slate-300">
                    {copiedId === t.id ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5" />}
                 </button>
              </div>
              <div className="space-y-1 mb-4 overflow-hidden">
                 <p className="text-xs font-black text-[#0F172A] uppercase tracking-tighter truncate leading-none">
                   {t.lastName ? t.lastName.toUpperCase() : t.name}
                 </p>
                 <p className="text-[8px] font-black font-mono text-primary/60 uppercase tracking-tighter truncate">{t.id}</p>
                 <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{t.subject || "GENERAL"}</p>
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                 <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/5 rounded-lg" onClick={() => handleEditClick(t)}><Edit3 className="w-5 h-5" /></Button>
                 <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(t.id)}><Trash2 className="w-5 h-5" /></Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
          <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden shadow-2xl sm:max-w-[420px] rounded-[2.5rem]">
            <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white rounded-xl shadow-lg shrink-0 rotate-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black tracking-tighter uppercase">Modifier Profil</DialogTitle>
                  <DialogDescription className="text-white/60 text-[9px] font-black uppercase tracking-widest">ID : {editingTeacher?.id}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                  <Input 
                    className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                    value={editFormData.firstName} 
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <Input 
                    className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                    value={editFormData.lastName} 
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Discipline</label>
                <Input 
                  className="h-11 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs text-[#0F172A]" 
                  value={editFormData.subject} 
                  onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut</label>
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
              <Button className="bg-primary hover:bg-slate-900 text-white font-black w-full h-14 rounded-xl shadow-xl transition-all text-sm uppercase border-2 border-white/10" onClick={handleUpdate}>
                <Save className="w-6 h-6 mr-2" /> Appliquer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
