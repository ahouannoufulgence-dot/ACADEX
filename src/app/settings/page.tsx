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
  Mail, 
  Phone, 
  MapPin,
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
    academicYear: "2023-2024",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (schoolConfig) {
      setSchoolData({
        name: schoolConfig.name || "",
        slogan: schoolConfig.slogan || "",
        academicYear: schoolConfig.academicYear || "2023-2024",
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
      <div className="space-y-8 md:space-y-16 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-sm md:text-3xl font-black opacity-80 uppercase tracking-[0.4em]">Pilotage Élite</p>
          </div>
          {isSaving && <Badge className="bg-primary text-white h-10 px-6 rounded-xl animate-pulse font-black shadow-xl text-xs uppercase tracking-widest shrink-0">Sync...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-8 md:space-y-12">
          <TabsList className="bg-white/80 p-1.5 h-14 md:h-20 rounded-2xl md:rounded-[2.5rem] border-4 border-white shadow-2xl w-full flex overflow-x-auto no-scrollbar backdrop-blur-xl">
            <TabsTrigger value="school" className="flex-1 px-6 md:px-10 h-full rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-lg uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Building2 className="w-4 h-4 md:w-6 md:h-6 mr-3" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 px-6 md:px-10 h-full rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-lg uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <BookOpen className="w-4 h-4 md:w-6 md:h-6 mr-3" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white/95 p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem]">
                <CardHeader className="p-0 pb-8 border-b-4 border-slate-50 flex flex-row items-center gap-5">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-[1.25rem] flex items-center justify-center text-primary shrink-0 rotate-3 border-2 border-primary/5 shadow-inner">
                    <Sparkles className="w-6 h-6 md:w-10 md:h-10" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Branding</CardTitle>
                    <CardDescription className="text-[10px] md:text-lg font-black text-slate-400 uppercase mt-1">Identité visuelle</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-10 space-y-8 md:space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-1">Nom Officiel</label>
                      <div className="relative group">
                        <School className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-7 md:w-7 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-14 md:h-20 pl-14 md:pl-16 bg-slate-50 border-4 border-slate-100 rounded-xl md:rounded-[1.5rem] font-black text-lg md:text-2xl text-[#0F172A] focus:border-primary/40 shadow-inner"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-1">Slogan</label>
                      <div className="relative">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-7 md:w-7 text-slate-300" />
                        <Input 
                          className="h-14 md:h-20 pl-14 md:pl-16 bg-slate-50 border-4 border-slate-100 rounded-xl md:rounded-[1.5rem] font-black text-base md:text-xl text-[#0F172A] italic shadow-inner"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t-4 border-slate-50">
                    <Button 
                      className="bg-primary hover:bg-slate-900 text-white font-black h-16 md:h-24 w-full rounded-xl md:rounded-[2rem] shadow-2xl transition-all text-lg md:text-2xl uppercase border-4 border-white/10"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-7 h-7 md:w-10 md:h-10 animate-spin mr-4" /> : <Save className="w-7 h-7 md:w-10 md:h-10 mr-4 md:mr-6" />}
                      Appliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl overflow-hidden relative p-8 md:p-14 h-fit rounded-[2.5rem] md:rounded-[3.5rem]">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <CalendarDays size={200} />
                </div>
                <CardHeader className="p-0 pb-8 relative z-10 border-b-4 border-white/10">
                  <CardTitle className="text-2xl md:text-4xl font-black flex items-center gap-5 tracking-tighter uppercase leading-none">
                    <CalendarDays className="w-7 h-7 md:w-12 md:h-12 text-accent" />
                    Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-8 relative z-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.4em] ml-1">Année Académique</label>
                    <Input 
                      className="h-16 md:h-24 bg-white/10 border-4 border-white/20 text-white text-3xl md:text-5xl font-black rounded-xl md:rounded-[2rem] focus:border-accent text-center tracking-tighter shadow-2xl"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <Badge variant="outline" className="border-accent text-accent font-black h-10 md:h-12 px-6 md:px-10 rounded-xl text-[9px] md:text-base uppercase tracking-[0.3em] bg-white/10 shadow-lg">T1 — En Cours</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="vivid-box border-none shadow-2xl bg-white/95 p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem]">
              <CardHeader className="p-0 pb-8 border-b-4 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <CardTitle className="text-3xl md:text-6xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Matières</CardTitle>
                  <CardDescription className="text-[10px] md:text-xl font-black text-slate-400 uppercase mt-1">Structure académique</CardDescription>
                </div>
                <div className="flex items-center gap-5 bg-slate-50 p-4 md:p-6 rounded-[1.5rem] shadow-inner border-4 border-slate-100">
                   <div className="p-4 bg-primary/10 rounded-xl text-primary shrink-0 rotate-6">
                      <GraduationCap className="w-8 h-8 md:w-12 md:h-12" />
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Inscrites</p>
                      <p className="text-3xl md:text-5xl font-black text-[#0F172A] leading-none">{subjects?.length || 0}</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-10">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 mb-10 p-6 md:p-10 rounded-[2rem] bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <div className="col-span-2 lg:col-span-1 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Intitulé</label>
                    <input 
                      placeholder="Ex: Maths" 
                      className="h-12 md:h-16 bg-white border-4 border-slate-200 rounded-lg md:rounded-xl font-black text-lg px-4 outline-none focus:border-primary shadow-xl text-[#0F172A]"
                      value={newSub.subject}
                      onChange={e => setNewSub({...newSub, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Niveau</label>
                    <input 
                      placeholder="Collège" 
                      className="h-12 md:h-16 bg-white border-4 border-slate-200 rounded-lg md:rounded-xl font-bold text-lg px-4 outline-none text-[#0F172A] shadow-xl"
                      value={newSub.level}
                      onChange={e => setNewSub({...newSub, level: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Classe</label>
                    <input 
                      placeholder="3EME" 
                      className="h-12 md:h-16 bg-white border-4 border-slate-200 rounded-lg md:rounded-xl font-bold text-lg px-4 outline-none text-[#0F172A] shadow-xl"
                      value={newSub.gradeLevel}
                      onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Coeff</label>
                    <input 
                      type="number" 
                      placeholder="4" 
                      className="h-12 md:h-16 bg-white border-4 border-slate-200 rounded-lg md:rounded-xl text-center font-black text-2xl text-primary outline-none focus:border-primary shadow-xl"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end col-span-2 lg:col-span-1">
                    <Button onClick={handleAddSubject} className="w-full h-12 md:h-16 bg-accent hover:bg-slate-900 text-white font-black rounded-lg md:rounded-xl shadow-xl transition-all text-xs md:text-lg uppercase tracking-widest border-4 border-white/20">
                      <Plus className="w-5 h-5 md:w-8 md:h-8 mr-2" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-[2rem] border-8 border-slate-50 overflow-hidden shadow-2xl bg-white">
                  <div className="overflow-x-auto no-scrollbar">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow className="border-none h-14 md:h-20">
                          <TableHead className="pl-8 md:pl-12 text-white font-black uppercase text-[9px] md:text-lg tracking-[0.3em]">Matière</TableHead>
                          <TableHead className="text-white font-black uppercase text-[9px] md:text-lg tracking-[0.3em] hidden sm:table-cell">Infos</TableHead>
                          <TableHead className="text-center text-white font-black uppercase text-[9px] md:text-lg tracking-[0.3em]">Coeff</TableHead>
                          <TableHead className="text-right pr-8 md:pr-12 text-white font-black uppercase text-[9px] md:text-lg tracking-[0.3em]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSubjects ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                        ) : subjects?.map((item: any) => (
                          <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-b-4 border-slate-50 group">
                            <TableCell className="pl-8 md:pl-12 py-6 md:py-10">
                               <p className="font-black text-[#0F172A] text-lg md:text-3xl tracking-tighter uppercase leading-none">{item.name}</p>
                            </TableCell>
                            <TableCell className="py-6 md:py-10 hidden sm:table-cell">
                               <div className="flex gap-3">
                                 <Badge variant="outline" className="text-[10px] md:text-sm font-black uppercase border-4 border-primary/5 bg-primary/5 text-primary px-4 md:px-6 h-8 md:h-10 rounded-lg md:rounded-xl">{item.level}</Badge>
                                 <Badge variant="outline" className="text-[10px] md:text-sm font-black uppercase border-4 border-slate-100 bg-slate-50 text-slate-500 px-4 md:px-6 h-8 md:h-10 rounded-lg md:rounded-xl">{item.gradeLevel}</Badge>
                               </div>
                            </TableCell>
                            <TableCell className="text-center py-6 md:py-10">
                                <Badge className="bg-white text-primary font-black text-xl md:text-4xl h-12 md:h-18 px-6 md:px-10 border-4 border-primary/10 shadow-lg rounded-xl md:rounded-[1.5rem]">
                                  {item.coefficient}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8 md:pr-12 py-6 md:py-10">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 md:h-14 md:w-14 text-slate-200 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                                onClick={() => handleDeleteSubject(item.id)}
                              >
                                <Trash2 className="w-5 h-5 md:w-8 md:h-8" />
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