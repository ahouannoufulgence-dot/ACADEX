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
          description: "La plateforme ACADEX a été personnalisée pour votre école.",
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
        description: "Veuillez remplir toutes les informations académiques.",
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
    toast({ title: "Matière créée", description: "Le nouveau coefficient est effectif." });
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
    toast({ title: "Suppression réussie", description: "La matière a été retirée du système." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-16 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Small Cadran Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full text-left">
            <h1 className="text-4xl md:text-8xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-sm md:text-3xl font-black opacity-80 uppercase tracking-[0.4em]">Pilotage Élite</p>
          </div>
          {isSaving && <Badge className="bg-primary text-white h-12 px-8 rounded-2xl animate-pulse font-black shadow-2xl text-sm uppercase tracking-widest border-4 border-white/20 shrink-0">Sync...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-8 md:space-y-12">
          <TabsList className="bg-white/80 p-2 h-16 md:h-24 rounded-2xl md:rounded-[3rem] border-4 border-white shadow-2xl w-full flex overflow-x-auto no-scrollbar backdrop-blur-xl">
            <TabsTrigger value="school" className="flex-1 px-6 md:px-12 h-full rounded-xl md:rounded-[2.5rem] font-black text-[11px] md:text-xl uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all">
              <Building2 className="w-5 h-5 md:w-8 md:h-8 mr-3 md:mr-5" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 px-6 md:px-12 h-full rounded-xl md:rounded-[2.5rem] font-black text-[11px] md:text-xl uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all">
              <BookOpen className="w-5 h-5 md:w-8 md:h-8 mr-3 md:mr-5" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <Card className="lg:col-span-2 vivid-box border-none shadow-[0_40px_100px_rgba(0,0,0,0.3)] bg-white/95 p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem]">
                <CardHeader className="p-0 pb-10 border-b-4 border-slate-50 flex flex-row items-center gap-6">
                  <div className="w-14 h-14 md:w-24 md:h-24 bg-primary/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-primary shrink-0 rotate-3 border-4 border-primary/5 shadow-inner">
                    <Sparkles className="w-8 h-8 md:w-14 md:h-14" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl md:text-6xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Branding</CardTitle>
                    <CardDescription className="text-[12px] md:text-xl font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Identité de l'école</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-10 space-y-8 md:space-y-14">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14">
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-2">Nom Officiel</label>
                      <div className="relative group">
                        <School className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-16 md:h-24 pl-16 md:pl-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[2rem] font-black text-xl md:text-3xl text-[#0F172A] focus:border-primary/40 shadow-inner"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-2">Slogan</label>
                      <div className="relative group">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-slate-300 transition-colors" />
                        <Input 
                          className="h-16 md:h-24 pl-16 md:pl-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl text-[#0F172A] italic shadow-inner"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14">
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-2">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-slate-300" />
                        <Input 
                          className="h-16 md:h-24 pl-16 md:pl-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl text-[#0F172A] shadow-inner"
                          value={schoolData.email}
                          onChange={e => setSchoolData({...schoolData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.4em] ml-2">Téléphone</label>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-slate-300" />
                        <Input 
                          className="h-16 md:h-24 pl-16 md:pl-20 bg-slate-50 border-4 border-slate-100 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl text-[#0F172A] shadow-inner"
                          value={schoolData.phone}
                          onChange={e => setSchoolData({...schoolData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t-4 border-slate-50">
                    <Button 
                      className="bg-primary hover:bg-slate-900 text-white font-black h-18 md:h-28 w-full rounded-2xl md:rounded-[2.5rem] shadow-2xl transition-all active:scale-95 text-xl md:text-3xl uppercase border-4 border-white/10"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin mr-5" /> : <Save className="w-8 h-8 md:w-12 md:h-12 mr-5 md:mr-8" />}
                      Appliquer les Changements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl overflow-hidden relative group p-8 md:p-16 h-fit rounded-[2.5rem] md:rounded-[4rem]">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                  <CalendarDays size={250} />
                </div>
                <CardHeader className="p-0 pb-10 relative z-10 border-b-4 border-white/10">
                  <CardTitle className="text-3xl md:text-5xl font-black flex items-center gap-6 tracking-tighter uppercase leading-none">
                    <CalendarDays className="w-8 h-8 md:w-16 md:h-16 text-accent" />
                    Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-10 relative z-10 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[12px] font-black text-emerald-300 uppercase tracking-[0.4em] ml-2">Année Académique</label>
                    <Input 
                      className="h-20 md:h-32 bg-white/10 border-4 border-white/20 text-white placeholder:text-white/40 text-4xl md:text-7xl font-black rounded-2xl md:rounded-[2.5rem] focus:border-accent text-center tracking-tighter shadow-2xl"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <div className="p-6 md:p-10 rounded-2xl md:rounded-[2rem] bg-white/5 border-4 border-white/10 space-y-6 shadow-2xl backdrop-blur-xl">
                    <p className="text-sm md:text-xl font-black text-emerald-100 leading-tight italic uppercase tracking-tighter opacity-80">
                      Cette valeur régit l'archivage et les moyennes globales du système.
                    </p>
                    <Badge variant="outline" className="border-accent text-accent font-black h-10 md:h-14 px-8 md:px-12 rounded-xl md:rounded-2xl text-[10px] md:text-lg uppercase tracking-[0.3em] bg-white/10 shadow-lg">T1 — En Cours</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="vivid-box border-none shadow-[0_50px_150px_rgba(0,0,0,0.3)] bg-white/95 p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem]">
              <CardHeader className="p-0 pb-10 border-b-4 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                  <CardTitle className="text-3xl md:text-7xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Matières</CardTitle>
                  <CardDescription className="text-sm md:text-2xl font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Structure & Coefficients</CardDescription>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 p-4 md:p-8 rounded-[2rem] shadow-inner border-4 border-slate-100">
                   <div className="p-5 bg-primary/10 rounded-2xl text-primary shrink-0 rotate-6">
                      <GraduationCap className="w-10 h-10 md:w-16 md:h-16" />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] md:sm font-black text-slate-400 uppercase tracking-[0.4em]">Inscrites</p>
                      <p className="text-3xl md:text-7xl font-black text-[#0F172A] leading-none">{subjects?.length || 0}</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-10 mb-10 md:mb-20 p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <div className="col-span-2 lg:col-span-1 space-y-3">
                    <label className="text-[10px] md:sm font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Intitulé</label>
                    <input 
                      placeholder="Ex: Maths" 
                      className="h-14 md:h-20 bg-white border-4 border-slate-200 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl px-5 outline-none focus:border-primary shadow-xl text-[#0F172A]"
                      value={newSub.subject}
                      onChange={e => setNewSub({...newSub, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] md:sm font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Niveau</label>
                    <input 
                      placeholder="Collège" 
                      className="h-14 md:h-20 bg-white border-4 border-slate-200 rounded-xl md:rounded-2xl font-bold text-lg md:text-2xl px-5 outline-none text-[#0F172A] shadow-xl"
                      value={newSub.level}
                      onChange={e => setNewSub({...newSub, level: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] md:sm font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Classe</label>
                    <input 
                      placeholder="3EME" 
                      className="h-14 md:h-20 bg-white border-4 border-slate-200 rounded-xl md:rounded-2xl font-bold text-lg md:text-2xl px-5 outline-none text-[#0F172A] shadow-xl"
                      value={newSub.gradeLevel}
                      onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] md:sm font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Coeff</label>
                    <input 
                      type="number" 
                      placeholder="4" 
                      className="h-14 md:h-20 bg-white border-4 border-slate-200 rounded-xl md:rounded-2xl text-center font-black text-2xl md:text-4xl text-primary outline-none focus:border-primary shadow-xl"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end col-span-2 lg:col-span-1">
                    <Button onClick={handleAddSubject} className="w-full h-14 md:h-20 bg-accent hover:bg-slate-900 text-white font-black rounded-xl md:rounded-2xl shadow-2xl transition-all active:scale-95 text-xs md:text-xl uppercase tracking-widest border-4 border-white/20">
                      <Plus className="w-6 h-6 md:w-10 md:h-10 mr-3" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-[2.5rem] md:rounded-[4rem] border-8 border-slate-50 overflow-hidden shadow-2xl bg-white">
                  <div className="overflow-x-auto no-scrollbar">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow className="border-none h-16 md:h-28">
                          <TableHead className="pl-8 md:pl-20 text-white font-black uppercase text-[10px] md:text-xl tracking-[0.3em]">Matière</TableHead>
                          <TableHead className="text-white font-black uppercase text-[10px] md:text-xl tracking-[0.3em] hidden sm:table-cell">Infos</TableHead>
                          <TableHead className="text-center text-white font-black uppercase text-[10px] md:text-xl tracking-[0.3em]">Coeff</TableHead>
                          <TableHead className="text-right pr-8 md:pr-20 text-white font-black uppercase text-[10px] md:text-xl tracking-[0.3em]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSubjects ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-32"><Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                        ) : subjects?.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-32 text-slate-300 font-black uppercase tracking-[0.4em] text-sm md:text-4xl opacity-30">Registre Vide</TableCell></TableRow>
                        ) : (
                          subjects?.map((item: any) => (
                            <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-b-4 border-slate-50 group">
                              <TableCell className="pl-8 md:pl-20 py-6 md:py-12">
                                 <p className="font-black text-[#0F172A] text-lg md:text-4xl tracking-tighter uppercase leading-none">{item.name}</p>
                                 <div className="sm:hidden mt-3 flex gap-2">
                                    <Badge className="bg-slate-100 text-slate-400 text-[8px] px-2 py-1 h-5 border-none uppercase font-black">{item.gradeLevel}</Badge>
                                 </div>
                              </TableCell>
                              <TableCell className="py-6 md:py-12 hidden sm:table-cell">
                                 <div className="flex gap-4">
                                   <Badge variant="outline" className="text-xs md:text-lg font-black uppercase border-4 border-primary/10 bg-primary/5 text-primary px-5 md:px-8 h-10 md:h-14 rounded-xl md:rounded-2xl">{item.level}</Badge>
                                   <Badge variant="outline" className="text-xs md:text-lg font-black uppercase border-4 border-slate-100 bg-slate-50 text-slate-500 px-5 md:px-8 h-10 md:h-14 rounded-xl md:rounded-2xl">{item.gradeLevel}</Badge>
                                 </div>
                              </TableCell>
                              <TableCell className="text-center py-6 md:py-12">
                                <div className="inline-block p-1 md:p-3 bg-primary/5 rounded-2xl md:rounded-[2.5rem] border-4 border-primary/10 shadow-inner">
                                  <Badge className="bg-white text-primary font-black text-2xl md:text-6xl h-14 md:h-28 px-8 md:px-14 border-4 border-white shadow-2xl rounded-xl md:rounded-[2rem]">
                                    {item.coefficient}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-8 md:pr-20 py-6 md:py-12">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 md:h-24 md:w-24 text-slate-200 hover:text-destructive hover:bg-destructive/5 rounded-2xl md:rounded-[2.5rem] transition-all"
                                  onClick={() => handleDeleteSubject(item.id)}
                                >
                                  <Trash2 className="w-6 h-6 md:w-12 md:h-12" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
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