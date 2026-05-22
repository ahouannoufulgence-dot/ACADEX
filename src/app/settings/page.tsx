
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
import { collection, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [newSub, setNewSub] = useState({ subject: "", coeff: "", level: "", gradeLevel: "" });

  // School Config
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
    return collection(db, "subjects");
  }, [db]);

  const { data: subjects, loading: loadingSubjects } = useCollection(subjectsQuery);

  const handleSaveSchool = () => {
    if (!db || !schoolConfigRef) return;
    setIsSaving(true);
    
    setDoc(schoolConfigRef, schoolData, { merge: true })
      .then(() => {
        toast({
          title: "Configuration mise à jour",
          description: "L'identité d'ACADEX a été personnalisée pour votre école.",
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
        title: "Champs manquants",
        description: "Veuillez remplir toutes les informations de la matière.",
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
    toast({ title: "Matière ajoutée", description: "La liste a été mise à jour." });
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
    toast({ title: "Matière supprimée", description: "Le coefficient a été retiré." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-headline font-bold text-[#111827] mb-2">Configuration Maîtresse</h1>
            <p className="text-slate-500 text-lg font-medium">Personnalisez ACADEX pour votre établissement.</p>
          </div>
          {isSaving && <Badge className="bg-accent text-white h-10 px-6 animate-pulse">Enregistrement...</Badge>}
        </div>

        <Tabs defaultValue="school" className="space-y-8">
          <TabsList className="bg-white p-1 h-14 rounded-2xl border border-slate-100 shadow-sm">
            <TabsTrigger value="school" className="px-8 rounded-xl font-bold data-[state=active]:bg-[#14532D] data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" /> Identité École
            </TabsTrigger>
            <TabsTrigger value="academic" className="px-8 rounded-xl font-bold data-[state=active]:bg-[#14532D] data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" /> Matières & Coeffs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 premium-card border-none shadow-2xl">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                    <Sparkles className="w-6 h-6 text-accent" />
                    Branding & Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom de l'Etablissement</label>
                      <div className="relative">
                        <School className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                        <Input 
                          placeholder="Ex: Complexe Scolaire ACADEX"
                          className="h-14 pl-12 bg-slate-50 border-none rounded-xl font-bold"
                          value={schoolData.name}
                          onChange={e => setSchoolData({...schoolData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slogan Pédagogique</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                        <Input 
                          placeholder="Ex: Excellence et Réussite"
                          className="h-14 pl-12 bg-slate-50 border-none rounded-xl"
                          value={schoolData.slogan}
                          onChange={e => setSchoolData({...schoolData, slogan: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email de contact</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                        <Input 
                          type="email"
                          className="h-14 pl-12 bg-slate-50 border-none rounded-xl"
                          value={schoolData.email}
                          onChange={e => setSchoolData({...schoolData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                        <Input 
                          className="h-14 pl-12 bg-slate-50 border-none rounded-xl"
                          value={schoolData.phone}
                          onChange={e => setSchoolData({...schoolData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adresse Physique</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-300" />
                      <Input 
                        className="h-14 pl-12 bg-slate-50 border-none rounded-xl"
                        value={schoolData.address}
                        onChange={e => setSchoolData({...schoolData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                    <Button 
                      className="bg-[#14532D] hover:bg-[#1a6b3a] text-white font-bold h-16 px-12 rounded-2xl shadow-xl transition-all active:scale-95"
                      onClick={handleSaveSchool}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                      Appliquer les changements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card bg-[#14532D] text-white border-none shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <CalendarDays size={180} />
                </div>
                <CardHeader className="p-10 relative z-10">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-accent" />
                    Calendrier Actif
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0 relative z-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Année Académique</label>
                    <Input 
                      className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-xl font-black rounded-xl"
                      value={schoolData.academicYear}
                      onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})}
                    />
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <p className="text-xs font-medium text-emerald-100/80 leading-relaxed">
                      L'année académique définit le cadre de calcul des bulletins et l'archivage automatique des données.
                    </p>
                    <Badge variant="outline" className="border-accent text-accent font-bold px-4 py-1">Premier Trimestre Actif</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="animate-in fade-in slide-in-from-bottom-4">
            <Card className="premium-card border-none shadow-2xl">
              <CardHeader className="p-10 pb-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Matières & Coefficients</CardTitle>
                  <CardDescription className="text-lg">Configurez les poids, niveaux et classes pour le calcul des moyennes.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom Matière</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-4 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Ex: Maths" 
                        className="h-12 pl-10 bg-white border-none rounded-xl font-bold"
                        value={newSub.subject}
                        onChange={e => setNewSub({...newSub, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Niveau</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-4 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Ex: 1er Cycle" 
                        className="h-12 pl-10 bg-white border-none rounded-xl"
                        value={newSub.level}
                        onChange={e => setNewSub({...newSub, level: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classe</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-4 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Ex: 3ème" 
                        className="h-12 pl-10 bg-white border-none rounded-xl"
                        value={newSub.gradeLevel}
                        onChange={e => setNewSub({...newSub, gradeLevel: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coeff</label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 4" 
                      className="h-12 bg-white border-none rounded-xl text-center font-black"
                      value={newSub.coeff}
                      onChange={e => setNewSub({...newSub, coeff: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddSubject} className="w-full h-12 bg-accent hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                      <Plus className="w-5 h-5 mr-2" /> Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-100">
                        <TableHead className="h-16 pl-10 text-[#111827] font-bold uppercase text-xs tracking-widest">Intitulé</TableHead>
                        <TableHead className="h-16 text-[#111827] font-bold uppercase text-xs tracking-widest">Niveau</TableHead>
                        <TableHead className="h-16 text-[#111827] font-bold uppercase text-xs tracking-widest">Classe</TableHead>
                        <TableHead className="h-16 text-[#111827] font-bold text-center uppercase text-xs tracking-widest">Coefficient</TableHead>
                        <TableHead className="h-16 text-right pr-10 text-[#111827] font-bold uppercase text-xs tracking-widest">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingSubjects ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">Chargement...</TableCell></TableRow>
                      ) : subjects?.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">Aucune matière configurée.</TableCell></TableRow>
                      ) : (
                        subjects?.map((item: any) => (
                          <TableRow key={item.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                            <TableCell className="pl-10 py-6 font-bold text-[#111827]">{item.name}</TableCell>
                            <TableCell className="py-6">
                               <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-200">{item.level}</Badge>
                            </TableCell>
                            <TableCell className="py-6">
                               <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-200">{item.gradeLevel}</Badge>
                            </TableCell>
                            <TableCell className="text-center py-6">
                              <Badge className="bg-accent/10 text-accent font-black text-lg px-3 py-1 h-8 border-none">
                                {item.coefficient}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-10 py-6">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 text-slate-300 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                onClick={() => handleDeleteSubject(item.id)}
                              >
                                <Trash2 className="w-5 h-5" />
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
