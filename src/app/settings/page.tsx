
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Save, Trash2, BookOpen, Building2, Sparkles, School, Globe, CalendarDays, Loader2, GraduationCap, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, setDoc, query, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [newSub, setNewSub] = useState({ subject: "", coeff: "", level: "", gradeLevel: "" });

  const schoolConfigRef = useMemo(() => (db ? doc(db, "config", "school") : null), [db]);
  const { data: schoolConfig } = useDoc(schoolConfigRef);
  
  const [schoolData, setSchoolData] = useState({
    name: "",
    slogan: "",
    academicYear: "2026-2027",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (schoolConfig) {
      setSchoolData({
        name: schoolConfig.name || "",
        slogan: schoolConfig.slogan || "",
        academicYear: schoolConfig.academicYear || "2026-2027",
        email: schoolConfig.email || "",
        phone: schoolConfig.phone || "",
        address: schoolConfig.address || ""
      });
    }
  }, [schoolConfig]);

  const subjectsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "subjects"), orderBy("name", "asc"));
  }, [db]);

  const { data: subjects, loading: loadingSubjects } = useCollection(subjectsQuery);

  const handleSaveSchool = () => {
    if (!db || !schoolConfigRef) return;
    setIsSaving(true);
    
    setDoc(schoolConfigRef, schoolData, { merge: true })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'config/school',
          operation: 'write',
          requestResourceData: schoolData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    toast({ title: "Mise à jour spontanée", description: "Configuration Élite appliquée." });
    setIsSaving(false);
  };

  const handleAddSubject = () => {
    if (!db || !newSub.subject || !newSub.coeff || !newSub.level || !newSub.gradeLevel) {
      toast({ variant: "destructive", title: "Erreur", description: "Remplissez tous les champs." });
      return;
    }
    
    const data = {
      name: newSub.subject,
      coefficient: Number(newSub.coeff),
      level: newSub.level,
      gradeLevel: newSub.gradeLevel,
    };

    addDoc(collection(db, "subjects"), data)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'subjects',
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    setNewSub({ subject: "", coeff: "", level: "", gradeLevel: "" });
    toast({ title: "Matière ajoutée", description: "Registre mis à jour instantanément." });
  };

  const handleDeleteSubject = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "subjects", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `subjects/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    toast({ title: "Supprimé", description: "Mise à jour spontanée." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-[10px] md:text-2xl font-black opacity-60 uppercase tracking-[0.4em] leading-none mt-2">Pilotage Élite 2026-2027</p>
          </div>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl rotate-3 border-4 border-white/20 shrink-0">
             <Settings className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
        </div>

        <Tabs defaultValue="school" className="space-y-8 md:space-y-12">
          <TabsList className="bg-white/80 p-2 h-14 md:h-20 rounded-2xl md:rounded-3xl border-4 border-white shadow-2xl w-full flex backdrop-blur-3xl">
            <TabsTrigger value="school" className="flex-1 rounded-xl md:rounded-2xl font-black text-[10px] md:text-lg uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Building2 className="w-7 h-7 md:w-9 md:h-9 mr-3" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 rounded-xl md:rounded-2xl font-black text-[10px] md:text-lg uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <BookOpen className="w-7 h-7 md:w-9 md:h-9 mr-3" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white/95 p-6 md:p-14 rounded-[2.5rem] md:rounded-[4rem]">
                <CardHeader className="p-0 pb-6 md:pb-10 mb-8 md:mb-12 border-b-4 border-slate-50">
                  <div className="flex items-center gap-5 md:gap-8">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-xl md:rounded-3xl flex items-center justify-center text-primary shadow-inner rotate-3">
                      <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <CardTitle className="text-2xl md:text-5xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">Branding École</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2 md:space-y-4">
                      <label className="text-[10px] md:text-sm font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Nom Officiel</label>
                      <Input className="h-14 md:h-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[1.5rem] font-black text-lg md:text-2xl text-[#0F172A] shadow-inner px-6 md:px-8" value={schoolData.name} onChange={e => setSchoolData({...schoolData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:space-y-4">
                      <label className="text-[10px] md:text-sm font-black text-[#0F172A] uppercase tracking-[0.3em] ml-2">Slogan Stratégique</label>
                      <Input className="h-14 md:h-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[1.5rem] font-black text-sm md:text-xl italic text-[#0F172A] shadow-inner px-6 md:px-8" value={schoolData.slogan} onChange={e => setSchoolData({...schoolData, slogan: e.target.value})} />
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-slate-900 text-white font-black h-16 md:h-24 w-full rounded-2xl md:rounded-[2rem] shadow-2xl transition-all text-sm md:text-2xl uppercase border-4 border-white/10 mt-4" onClick={handleSaveSchool} disabled={isSaving}>
                    <Save className="w-7 h-7 md:w-11 md:h-11 mr-4" /> Appliquer les Changements
                  </Button>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-between overflow-hidden group">
                <div className="absolute right-[-30px] top-[-30px] opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                  <CalendarDays size={200} />
                </div>
                <CardHeader className="p-0 border-b-4 border-white/10 pb-6 md:pb-10 mb-6 md:mb-10 relative z-10">
                  <div className="flex items-center gap-5 md:gap-8">
                    <div className="p-3 md:p-5 bg-white rounded-xl md:rounded-2xl shadow-xl rotate-6 shrink-0">
                      <CalendarDays className="w-8 h-8 md:w-12 md:h-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">Session Active</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6 md:space-y-10 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.5em] text-accent/80 ml-2">Année Académique</label>
                    <Input className="h-16 md:h-24 bg-white/10 border-4 border-white/20 text-white text-2xl md:text-5xl font-black rounded-2xl md:rounded-[1.5rem] text-center outline-none focus:border-accent/50 shadow-2xl tracking-tighter" value={schoolData.academicYear} onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})} />
                  </div>
                  <Badge variant="outline" className="border-accent text-accent font-black h-10 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl text-[10px] md:text-sm uppercase tracking-[0.3em] bg-white/5 w-full justify-center shadow-xl border-2">Session Élite Active</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="vivid-box border-none shadow-2xl bg-white/95 p-6 md:p-14 rounded-[2.5rem] md:rounded-[4rem]">
              <CardHeader className="p-0 border-b-4 border-slate-50 pb-6 md:pb-10 mb-8 md:mb-14">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 md:gap-8">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-xl md:rounded-3xl flex items-center justify-center text-primary shadow-inner rotate-3">
                       <GraduationCap className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <CardTitle className="text-2xl md:text-5xl font-black text-[#0F172A] uppercase tracking-tighter">Matières Élite</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl border-4 border-slate-100 shadow-inner">
                    <GraduationCap className="w-7 h-7 md:w-10 md:h-10 text-primary" />
                    <span className="text-xl md:text-4xl font-black text-primary">{subjects?.length || 0}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-8 md:mb-12 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <input placeholder="Matière" className="h-14 md:h-16 bg-white border-2 border-slate-200 rounded-xl px-4 text-xs md:text-lg font-black outline-none focus:border-primary text-[#0F172A] shadow-md" value={newSub.subject} onChange={e => setNewSub({...newSub, subject: e.target.value})} />
                  <input placeholder="Niveau" className="h-14 md:h-16 bg-white border-2 border-slate-200 rounded-xl px-4 text-xs md:text-lg font-bold outline-none text-[#0F172A] shadow-md" value={newSub.level} onChange={e => setNewSub({...newSub, level: e.target.value})} />
                  <input placeholder="Classe" className="h-14 md:h-16 bg-white border-2 border-slate-200 rounded-xl px-4 text-xs md:text-lg font-bold outline-none text-[#0F172A] shadow-md" value={newSub.gradeLevel} onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})} />
                  <input type="number" placeholder="Coeff" className="h-14 md:h-16 bg-white border-2 border-slate-200 rounded-xl text-center font-black text-lg md:text-2xl text-primary shadow-md" value={newSub.coeff} onChange={e => setNewSub({...newSub, coeff: e.target.value})} />
                  <Button onClick={handleAddSubject} className="h-14 md:h-16 bg-accent hover:bg-slate-900 text-white font-black rounded-xl text-xs md:text-lg uppercase border-4 border-white/10 shadow-2xl col-span-2 md:col-span-1"><Plus className="w-7 h-7 md:w-8 md:h-8 mr-2" /> Ajouter</Button>
                </div>

                <div className="rounded-[2rem] md:rounded-[3.5rem] border-4 border-slate-50 overflow-hidden bg-white shadow-2xl">
                  <Table>
                    <TableHeader className="bg-slate-900">
                      <TableRow className="border-none h-16 md:h-20">
                        <TableHead className="pl-10 text-white font-black uppercase text-[10px] md:text-sm tracking-widest">Discipline</TableHead>
                        <TableHead className="text-center text-white font-black uppercase text-[10px] md:text-sm tracking-widest">Coefficient</TableHead>
                        <TableHead className="text-right pr-10 text-white font-black uppercase text-[10px] md:text-sm tracking-widest">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingSubjects ? (
                        <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="w-14 h-14 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                      ) : (
                        subjects?.map((item: any) => (
                          <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-b-2 border-slate-50 group">
                            <TableCell className="pl-10 py-6 md:py-10 font-black text-[#0F172A] text-sm md:text-2xl uppercase tracking-tighter">{item.name}</TableCell>
                            <TableCell className="text-center py-6 md:py-10">
                              <div className="inline-block p-2 bg-primary/10 rounded-xl border-2 border-primary/10">
                                <Badge className="bg-white text-primary font-black text-sm md:text-2xl border-2 border-slate-100 px-4 md:px-6 shadow-md h-10 md:h-16">{item.coefficient}</Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-10 py-6 md:py-10">
                              <Button variant="ghost" size="icon" className="h-12 w-12 md:h-16 md:w-16 text-slate-200 hover:text-destructive hover:bg-destructive/5 transition-all rounded-xl" onClick={() => handleDeleteSubject(item.id)}>
                                <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
