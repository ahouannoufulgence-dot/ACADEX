
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

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [newSub, setNewSub] = useState({ subject: "", coeff: "", level: "", gradeLevel: "" });

  // School Config persistence with Firebase
  const schoolConfigRef = useMemo(() => (db ? doc(db, "config", "school") : null), [db]);
  const { data: schoolConfig, loading: loadingConfig } = useDoc(schoolConfigRef);
  
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
      <div className="space-y-12 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter">Configuration Maîtresse</h1>
            <p className="text-slate-500 text-xl font-bold">Pilotez l'identité et les paramètres académiques d'ACADEX.</p>
          </div>
          {isSaving && <Badge className="bg-primary text-white h-12 px-8 rounded-2xl animate-pulse font-black shadow-xl">Synchronisation...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-10">
          <TabsList className="bg-white p-1.5 h-16 rounded-[1.5rem] border-2 border-slate-100 shadow-xl w-full sm:w-fit">
            <TabsTrigger value="school" className="px-10 h-full rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <Building2 className="w-5 h-5 mr-3" /> Identité École
            </TabsTrigger>
            <TabsTrigger value="academic" className="px-10 h-full rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <BookOpen className="w-5 h-5 mr-3" /> Matières & Coeffs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <Card className="lg:col-span-2 vivid-box border-none shadow-2xl bg-white">
                <CardHeader className="p-12 pb-6 border-b border-slate-50">
                  <CardTitle className="flex items-center gap-4 text-3xl font-black text-[#0F172A] tracking-tighter">
                    <Sparkles className="w-8 h-8 text-primary" />
                    Branding & Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'Etablissement</label>
                      <div className="relative group">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Ex: Complexe Scolaire ACADEX Élite"
                          className="h-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg focus:border-primary shadow-sm"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slogan Institutionnel</label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Ex: Excellence et Réussite de Demain"
                          className="h-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Officiel</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="email"
                          className="h-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                          value={schoolData.email}
                          onChange={e => setSchoolData({...schoolData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone de l'École</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input 
                          className="h-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                          value={schoolData.phone}
                          onChange={e => setSchoolData({...schoolData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Physique</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        className="h-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                        value={schoolData.address}
                        onChange={e => setSchoolData({...schoolData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-10 border-t-2 border-slate-50">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white font-black h-20 px-16 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all active:scale-95 text-xl"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-8 h-8 animate-spin mr-3" /> : <Save className="w-8 h-8 mr-4" />}
                      Appliquer les Changements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <CalendarDays size={220} />
                </div>
                <CardHeader className="p-12 relative z-10">
                  <CardTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter">
                    <CalendarDays className="w-8 h-8 text-accent" />
                    Calendrier Actif
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-12 pt-0 relative z-10 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-emerald-300 uppercase tracking-widest ml-1">Année Académique</label>
                    <Input 
                      className="h-20 bg-white/10 border-4 border-white/20 text-white placeholder:text-white/40 text-4xl font-black rounded-[1.5rem] focus:border-accent text-center tracking-tighter shadow-inner"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white/5 border-2 border-white/10 space-y-4 shadow-xl">
                    <p className="text-sm font-bold text-emerald-100/80 leading-relaxed italic">
                      L'année académique régit l'archivage et le calcul des moyennes globales sur toute la plateforme.
                    </p>
                    <Badge variant="outline" className="border-accent text-accent font-black h-10 px-6 rounded-xl text-xs uppercase tracking-widest bg-white/5">Trimestre 1 En Cours</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="animate-in fade-in slide-in-from-bottom-6">
            <Card className="vivid-box border-none shadow-2xl bg-white">
              <CardHeader className="p-12 pb-6 border-b border-slate-50">
                <CardTitle className="text-3xl font-black text-[#0F172A] tracking-tighter">Matières & Coefficients</CardTitle>
                <CardDescription className="text-xl font-bold mt-2">Structure académique globale de l'établissement.</CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 p-10 rounded-[3rem] bg-slate-50 border-4 border-slate-100 shadow-inner">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary" />
                      <Input 
                        placeholder="Ex: Maths" 
                        className="h-14 pl-12 bg-white border-2 border-slate-200 rounded-2xl font-black text-lg focus:border-primary shadow-sm"
                        value={newSub.subject}
                        onChange={e => setNewSub({...newSub, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau</label>
                    <div className="relative group">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary" />
                      <Input 
                        placeholder="Ex: Collège" 
                        className="h-14 pl-12 bg-white border-2 border-slate-200 rounded-2xl font-bold"
                        value={newSub.level}
                        onChange={e => setNewSub({...newSub, level: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                    <div className="relative group">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary" />
                      <Input 
                        placeholder="Ex: 3ème" 
                        className="h-14 pl-12 bg-white border-2 border-slate-200 rounded-2xl font-bold"
                        value={newSub.gradeLevel}
                        onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coefficient</label>
                    <Input 
                      type="number" 
                      placeholder="4" 
                      className="h-14 bg-white border-2 border-slate-200 rounded-2xl text-center font-black text-xl text-primary focus:border-primary shadow-sm"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddSubject} className="w-full h-14 bg-accent hover:bg-emerald-600 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-widest">
                      <Plus className="w-6 h-6 mr-3" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-[2rem] border-4 border-slate-100 overflow-hidden shadow-2xl bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-slate-100 h-20">
                        <TableHead className="pl-12 text-[#0F172A] font-black uppercase text-xs tracking-[0.2em]">Matière</TableHead>
                        <TableHead className="text-[#0F172A] font-black uppercase text-xs tracking-[0.2em]">Niveau & Classe</TableHead>
                        <TableHead className="text-center text-[#0F172A] font-black uppercase text-xs tracking-[0.2em]">Coefficient</TableHead>
                        <TableHead className="text-right pr-12 text-[#0F172A] font-black uppercase text-xs tracking-[0.2em]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingSubjects ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></TableCell></TableRow>
                      ) : subjects?.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-32 text-slate-300 italic font-bold text-xl uppercase tracking-widest opacity-30">Aucune donnée configurée</TableCell></TableRow>
                      ) : (
                        subjects?.map((item: any) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50 transition-all border-slate-100 group">
                            <TableCell className="pl-12 py-8">
                               <p className="font-black text-[#0F172A] text-2xl tracking-tighter">{item.name}</p>
                            </TableCell>
                            <TableCell className="py-8">
                               <div className="flex gap-3">
                                 <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/20 bg-white text-primary px-4 h-7 rounded-xl">{item.level}</Badge>
                                 <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200 bg-slate-50 text-slate-500 px-4 h-7 rounded-xl">{item.gradeLevel}</Badge>
                               </div>
                            </TableCell>
                            <TableCell className="text-center py-8">
                              <div className="inline-block p-1 bg-primary/5 rounded-2xl">
                                <Badge className="bg-white text-primary font-black text-2xl h-14 px-8 border-2 border-primary/5 shadow-xl rounded-xl">
                                  {item.coefficient}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-12 py-8">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-14 w-14 text-slate-300 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all"
                                onClick={() => handleDeleteSubject(item.id)}
                              >
                                <Trash2 className="w-7 h-7" />
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
