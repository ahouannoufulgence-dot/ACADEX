
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
  Layers,
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
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header - Compact for mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full text-left">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-sm md:text-2xl font-black opacity-80 uppercase tracking-widest">Pilotage Élite</p>
          </div>
          {isSaving && <Badge className="bg-primary text-white h-10 px-6 rounded-xl animate-pulse font-black shadow-lg text-[10px] md:text-sm uppercase tracking-widest border-2 border-white/10 shrink-0">Sync...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-6 md:space-y-10">
          <TabsList className="bg-white p-1 md:p-1.5 h-12 md:h-16 rounded-xl md:rounded-[1.5rem] border-2 border-slate-100 shadow-xl w-full flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="school" className="flex-1 px-4 md:px-10 h-full rounded-lg md:rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all shrink-0">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 px-4 md:px-10 h-full rounded-lg md:rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all shrink-0">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
              <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white/95 p-4 md:p-12">
                <CardHeader className="p-0 pb-6 md:pb-10 border-b border-slate-50 flex flex-row items-center gap-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Branding</CardTitle>
                    <CardDescription className="text-[10px] md:text-base font-black text-slate-400 uppercase tracking-widest mt-1">Identité de l'école</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-6 md:pt-10 space-y-6 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                      <div className="relative group">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-12 md:h-16 pl-12 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-sm md:text-lg text-[#0F172A] focus:border-primary shadow-sm"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slogan</label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-12 md:h-16 pl-12 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-xs md:text-base text-[#0F172A]"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-12 md:h-16 pl-12 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-xs md:text-base text-[#0F172A]"
                          value={schoolData.email}
                          onChange={e => setSchoolData({...schoolData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-12 md:h-16 pl-12 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-xs md:text-base text-[#0F172A]"
                          value={schoolData.phone}
                          onChange={e => setSchoolData({...schoolData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        className="h-12 md:h-16 pl-12 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl font-black text-xs md:text-base text-[#0F172A]"
                        value={schoolData.address}
                        onChange={e => setSchoolData({...schoolData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6 md:pt-10 border-t-2 border-slate-50">
                    <Button 
                      className="bg-primary hover:bg-slate-900 text-white font-black h-14 md:h-20 w-full rounded-xl md:rounded-[2rem] shadow-2xl transition-all active:scale-95 text-xs md:text-xl uppercase border-2 border-white/10"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-5 h-5 md:w-8 md:h-8 mr-3 md:mr-4" />}
                      Appliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl overflow-hidden relative group p-6 md:p-12 h-fit">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <CalendarDays size={180} />
                </div>
                <CardHeader className="p-0 pb-6 relative z-10">
                  <CardTitle className="text-xl md:text-3xl font-black flex items-center gap-4 tracking-tighter uppercase">
                    <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                    Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative z-10 space-y-6 md:space-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-300 uppercase tracking-widest ml-1">Année</label>
                    <Input 
                      className="h-16 md:h-20 bg-white/10 border-4 border-white/20 text-white placeholder:text-white/40 text-2xl md:text-4xl font-black rounded-xl md:rounded-[1.5rem] focus:border-accent text-center tracking-tighter shadow-inner"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <div className="p-4 md:p-8 rounded-xl md:rounded-[2rem] bg-white/5 border-2 border-white/10 space-y-4 shadow-xl">
                    <p className="text-[10px] md:text-sm font-black text-emerald-100/80 leading-relaxed italic uppercase tracking-tighter">
                      Régit l'archivage et les moyennes globales.
                    </p>
                    <Badge variant="outline" className="border-accent text-accent font-black h-8 md:h-10 px-4 md:px-6 rounded-xl text-[8px] md:text-xs uppercase tracking-widest bg-white/5">T1 en cours</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <Card className="vivid-box border-none shadow-2xl bg-white/95 p-4 md:p-12">
              <CardHeader className="p-0 pb-6 md:pb-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl md:text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Matières</CardTitle>
                  <CardDescription className="text-[10px] md:text-base font-black text-slate-400 uppercase tracking-widest mt-1">Structure académique</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                      <GraduationCap className="w-6 h-6" />
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Inscrites</p>
                      <p className="text-sm md:text-xl font-black text-[#0F172A]">{subjects?.length || 0}</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6 md:pt-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-8 mb-6 md:mb-12 p-3 md:p-10 rounded-xl md:rounded-[3rem] bg-slate-50 border-2 md:border-4 border-slate-100 shadow-inner">
                  <div className="col-span-2 sm:col-span-1 space-y-1.5 md:space-y-3">
                    <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé</label>
                    <Input 
                      placeholder="Ex: Maths" 
                      className="h-10 md:h-14 bg-white border-2 border-slate-200 rounded-lg md:rounded-2xl font-black text-xs md:text-lg focus:border-primary shadow-sm text-[#0F172A]"
                      value={newSub.subject}
                      onChange={e => setNewSub({...newSub, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau</label>
                    <Input 
                      placeholder="Collège" 
                      className="h-10 md:h-14 bg-white border-2 border-slate-200 rounded-lg md:rounded-2xl font-bold text-xs md:text-base text-[#0F172A]"
                      value={newSub.level}
                      onChange={e => setNewSub({...newSub, level: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                    <Input 
                      placeholder="3EME" 
                      className="h-10 md:h-14 bg-white border-2 border-slate-200 rounded-lg md:rounded-2xl font-bold text-xs md:text-base text-[#0F172A]"
                      value={newSub.gradeLevel}
                      onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coeff</label>
                    <Input 
                      type="number" 
                      placeholder="4" 
                      className="h-10 md:h-14 bg-white border-2 border-slate-200 rounded-lg md:rounded-2xl text-center font-black text-sm md:text-xl text-primary focus:border-primary shadow-sm"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end col-span-2 lg:col-span-1">
                    <Button onClick={handleAddSubject} className="w-full h-10 md:h-14 bg-accent hover:bg-slate-900 text-white font-black rounded-lg md:rounded-2xl shadow-xl transition-all active:scale-95 text-[8px] md:text-xs uppercase tracking-widest border-2 border-white/10">
                      <Plus className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-3" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl md:rounded-[2rem] border-2 md:border-4 border-slate-100 overflow-hidden shadow-2xl bg-white">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow className="border-none h-12 md:h-20">
                          <TableHead className="pl-4 md:pl-12 text-white font-black uppercase text-[8px] md:text-xs tracking-widest">Matière</TableHead>
                          <TableHead className="text-white font-black uppercase text-[8px] md:text-xs tracking-widest hidden sm:table-cell">Infos</TableHead>
                          <TableHead className="text-center text-white font-black uppercase text-[8px] md:text-xs tracking-widest">Coeff</TableHead>
                          <TableHead className="text-right pr-4 md:pr-12 text-white font-black uppercase text-[8px] md:text-xs tracking-widest">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSubjects ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                        ) : subjects?.length === 0 ? (
                          <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-300 font-black uppercase tracking-widest text-xs opacity-40">Registre vide</TableCell></TableRow>
                        ) : (
                          subjects?.map((item: any) => (
                            <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-slate-100 group">
                              <TableCell className="pl-4 md:pl-12 py-4 md:py-8">
                                 <p className="font-black text-[#0F172A] text-xs md:text-2xl tracking-tighter uppercase leading-none">{item.name}</p>
                                 <div className="sm:hidden mt-2 flex gap-1">
                                    <Badge className="bg-slate-100 text-slate-400 text-[6px] px-1 py-0 h-3 border-none uppercase">{item.gradeLevel}</Badge>
                                 </div>
                              </TableCell>
                              <TableCell className="py-4 md:py-8 hidden sm:table-cell">
                                 <div className="flex gap-2">
                                   <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 bg-primary/5 text-primary px-3 h-6 rounded-lg">{item.level}</Badge>
                                   <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 bg-slate-50 text-slate-500 px-3 h-6 rounded-lg">{item.gradeLevel}</Badge>
                                 </div>
                              </TableCell>
                              <TableCell className="text-center py-4 md:py-8">
                                <div className="inline-block p-0.5 md:p-1 bg-primary/5 rounded-lg md:rounded-2xl">
                                  <Badge className="bg-white text-primary font-black text-sm md:text-2xl h-8 md:h-14 px-4 md:px-8 border-2 border-primary/5 shadow-md rounded-lg md:rounded-xl">
                                    {item.coefficient}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-4 md:pr-12 py-4 md:py-8">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 md:h-14 md:w-14 text-slate-300 hover:text-destructive hover:bg-destructive/5 rounded-lg md:rounded-2xl transition-all"
                                  onClick={() => handleDeleteSubject(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 md:w-7 md:h-7" />
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
