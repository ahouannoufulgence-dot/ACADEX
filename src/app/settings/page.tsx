
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Plus, 
  Save, 
  Trash2, 
  BookOpen, 
  Building2, 
  Sparkles, 
  School, 
  Globe, 
  CalendarDays,
  Loader2,
  GraduationCap
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
      .then(() => {
        toast({
          title: "Identité mise à jour",
          description: "La plateforme ACADEX a été personnalisée.",
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'config/school',
          operation: 'write',
          requestResourceData: schoolData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setIsSaving(false));
  };

  const handleAddSubject = () => {
    if (!db || !newSub.subject || !newSub.coeff || !newSub.level || !newSub.gradeLevel) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir toutes les informations.",
      });
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
    toast({ title: "Matière créée", description: "Le coefficient est effectif." });
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
    toast({ title: "Suppression réussie", description: "La matière a été retirée." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-[10px] md:text-xl font-black opacity-80 uppercase tracking-[0.3em]">Pilotage Élite</p>
          </div>
          {isSaving && <Badge className="bg-primary text-white h-8 px-4 rounded-xl animate-pulse font-black shadow-xl text-[9px] uppercase tracking-widest shrink-0">Sync...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-6 md:space-y-10">
          <TabsList className="bg-white/80 p-1 h-12 md:h-16 rounded-2xl md:rounded-[2rem] border-4 border-white shadow-2xl w-full flex overflow-x-auto no-scrollbar backdrop-blur-xl">
            <TabsTrigger value="school" className="flex-1 px-4 md:px-6 h-full rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-sm uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Building2 className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 px-4 md:px-6 h-full rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-sm uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <BookOpen className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white/95 p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
                <CardHeader className="p-0 pb-4 border-b-2 border-slate-50 flex flex-row items-center gap-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 rotate-3 border-2 border-primary/5 shadow-inner">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-3xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Branding</CardTitle>
                    <CardDescription className="text-[8px] md:text-xs font-black text-slate-400 uppercase mt-1">Identité visuelle</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-6 space-y-4 md:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-1">Nom Officiel</label>
                      <div className="relative group">
                        <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 h-3.5 md:w-4 md:h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-11 md:h-14 pl-10 md:pl-12 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-sm md:text-lg text-[#0F172A] focus:border-primary/40 shadow-inner"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black text-[#0F172A] uppercase tracking-[0.3em] ml-1">Slogan</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
                        <Input 
                          className="h-11 md:h-14 pl-10 md:pl-12 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-xs md:text-base text-[#0F172A] italic shadow-inner"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-slate-50">
                    <Button 
                      className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 w-full rounded-xl shadow-xl transition-all text-xs md:text-lg uppercase border-4 border-white/10"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mr-2" /> : <Save className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />}
                      Appliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl overflow-hidden relative p-5 md:p-8 h-fit rounded-[2rem]">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                  <CalendarDays size={100} />
                </div>
                <CardHeader className="p-0 pb-4 relative z-10 border-b-2 border-white/10">
                  <CardTitle className="text-lg md:text-2xl font-black flex items-center gap-3 tracking-tighter uppercase leading-none">
                    <CalendarDays className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                    Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-4 relative z-10 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] md:text-[9px] font-black text-emerald-300 uppercase tracking-[0.3em] ml-1">Année Académique</label>
                    <Input 
                      className="h-12 md:h-16 bg-white/10 border-4 border-white/20 text-white text-xl md:text-3xl font-black rounded-xl focus:border-accent text-center tracking-tighter shadow-xl"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <Badge variant="outline" className="border-accent text-accent font-black h-8 md:h-9 px-4 md:px-6 rounded-lg text-[7px] md:text-xs uppercase tracking-[0.3em] bg-white/10 shadow-md">T1 — En Cours</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="vivid-box border-none shadow-2xl bg-white/95 p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
              <CardHeader className="p-0 pb-4 border-b-2 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Matières</CardTitle>
                  <CardDescription className="text-[8px] md:text-sm font-black text-slate-400 uppercase mt-1">Structure académique</CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl shadow-inner border-2 border-slate-100">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 rotate-6">
                      <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
                   </div>
                   <div className="text-right">
                      <p className="text-[7px] font-black text-slate-400 uppercase">Inscrites</p>
                      <p className="text-xl md:text-3xl font-black text-[#0F172A] leading-none">{subjects?.length || 0}</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 mb-6 p-4 md:p-6 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 shadow-inner">
                  <div className="col-span-2 lg:col-span-1 space-y-1">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Intitulé</label>
                    <input 
                      placeholder="Ex: Maths" 
                      className="h-9 md:h-12 bg-white border-2 border-slate-200 rounded-lg font-black text-sm px-3 outline-none focus:border-primary shadow-md text-[#0F172A]"
                      value={newSub.subject}
                      onChange={e => setNewSub({...newSub, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Niveau</label>
                    <input 
                      placeholder="Collège" 
                      className="h-9 md:h-12 bg-white border-2 border-slate-200 rounded-lg font-bold text-sm px-3 outline-none text-[#0F172A] shadow-md"
                      value={newSub.level}
                      onChange={e => setNewSub({...newSub, level: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Classe</label>
                    <input 
                      placeholder="3EME" 
                      className="h-9 md:h-12 bg-white border-2 border-slate-200 rounded-lg font-bold text-sm px-3 outline-none text-[#0F172A] shadow-md"
                      value={newSub.gradeLevel}
                      onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Coeff</label>
                    <input 
                      type="number" 
                      placeholder="4" 
                      className="h-9 md:h-12 bg-white border-2 border-slate-200 rounded-lg text-center font-black text-lg text-primary outline-none focus:border-primary shadow-md"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end col-span-2 lg:col-span-1">
                    <Button onClick={handleAddSubject} className="w-full h-9 md:h-12 bg-accent hover:bg-slate-900 text-white font-black rounded-lg shadow-lg transition-all text-[9px] md:text-sm uppercase tracking-widest border-2 border-white/20">
                      <Plus className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border-2 border-slate-50 overflow-hidden shadow-xl bg-white">
                  <div className="overflow-x-auto no-scrollbar">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow className="border-none h-10 md:h-14">
                          <TableHead className="pl-4 md:pl-8 text-white font-black uppercase text-[7px] md:text-sm tracking-[0.3em]">Matière</TableHead>
                          <TableHead className="text-white font-black uppercase text-[7px] md:text-sm tracking-[0.3em] hidden sm:table-cell">Infos</TableHead>
                          <TableHead className="text-center text-white font-black uppercase text-[7px] md:text-sm tracking-[0.3em]">Coeff</TableHead>
                          <TableHead className="text-right pr-4 md:pr-8 text-white font-black uppercase text-[7px] md:text-sm tracking-[0.3em]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSubjects ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                        ) : subjects?.map((item: any) => (
                          <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-b-2 border-slate-50 group">
                            <TableCell className="pl-4 md:pl-8 py-4 md:py-6">
                               <p className="font-black text-[#0F172A] text-sm md:text-xl tracking-tighter uppercase leading-none">{item.name}</p>
                            </TableCell>
                            <TableCell className="py-4 md:py-6 hidden sm:table-cell">
                               <div className="flex gap-1.5">
                                 <Badge variant="outline" className="text-[8px] md:text-[10px] font-black uppercase border-2 border-primary/5 bg-primary/5 text-primary px-2 md:px-4 h-6 md:h-8 rounded-lg">{item.level}</Badge>
                                 <Badge variant="outline" className="text-[8px] md:text-[10px] font-black uppercase border-2 border-slate-100 bg-slate-50 text-slate-500 px-2 md:px-4 h-6 md:h-8 rounded-lg">{item.gradeLevel}</Badge>
                               </div>
                            </TableCell>
                            <TableCell className="text-center py-4 md:py-6">
                                <Badge className="bg-white text-primary font-black text-sm md:text-2xl h-8 md:h-12 px-3 md:px-6 border-2 border-primary/10 shadow-md rounded-lg">
                                  {item.coefficient}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4 md:pr-8 py-4 md:py-6">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 md:h-10 md:w-10 text-slate-200 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                                onClick={() => handleDeleteSubject(item.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
