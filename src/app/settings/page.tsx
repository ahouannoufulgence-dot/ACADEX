
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Save, Trash2, BookOpen, Building2, Sparkles, School, Globe, CalendarDays, Loader2, GraduationCap } from "lucide-react";
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
    
    // Spontané : pas de await
    setDoc(schoolConfigRef, schoolData, { merge: true })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'config/school',
          operation: 'write',
          requestResourceData: schoolData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    toast({ title: "Mise à jour spontanée", description: "Les paramètres ont été enregistrés." });
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
    toast({ title: "Matière ajoutée", description: "Mise à jour spontanée du registre." });
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
      <div className="space-y-6 md:space-y-10 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-5xl font-headline font-black text-[#0F172A] tracking-tighter uppercase leading-none">Configuration</h1>
            <p className="text-[#0F172A] text-[9px] md:text-lg font-black opacity-80 uppercase tracking-widest">Gestion Élite 2026-2027</p>
          </div>
        </div>

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="bg-white/80 p-1 h-12 md:h-14 rounded-xl border-4 border-white shadow-xl w-full flex backdrop-blur-xl">
            <TabsTrigger value="school" className="flex-1 rounded-lg font-black text-[9px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" /> Identité
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-1 rounded-lg font-black text-[9px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" /> Académique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 vivid-box border-none shadow-xl bg-white/95 p-6 rounded-[2rem]">
                <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Sparkles className="w-4 h-4" /></div>
                  <CardTitle className="text-lg md:text-2xl font-black text-[#0F172A] uppercase">Branding</CardTitle>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-[#0F172A] uppercase tracking-[0.2em] ml-1">Nom de l'école</label>
                      <Input className="h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm" value={schoolData.name} onChange={e => setSchoolData({...schoolData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-[#0F172A] uppercase tracking-[0.2em] ml-1">Slogan</label>
                      <Input className="h-10 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs italic" value={schoolData.slogan} onChange={e => setSchoolData({...schoolData, slogan: e.target.value})} />
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-slate-900 text-white font-black h-11 w-full rounded-xl shadow-lg transition-all text-xs uppercase" onClick={handleSaveSchool} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" /> Appliquer les changements
                  </Button>
                </div>
              </Card>

              <Card className="vivid-box bg-primary text-white border-none shadow-xl relative p-6 rounded-[2rem]">
                <div className="flex items-center gap-3 border-b-2 border-white/10 pb-4 mb-4">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg font-black uppercase tracking-tighter">Session Active</CardTitle>
                </div>
                <div className="space-y-4">
                  <Input className="h-12 bg-white/10 border-2 border-white/20 text-white text-xl font-black rounded-xl text-center" value={schoolData.academicYear} onChange={e => setSchoolData({...schoolData, academicYear: e.target.value})} />
                  <Badge variant="outline" className="border-accent text-accent font-black h-8 px-4 rounded-lg text-[8px] uppercase tracking-widest bg-white/5 w-full justify-center">Trimestre 1</Badge>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="vivid-box border-none shadow-xl bg-white/95 p-6 rounded-[2rem]">
              <div className="flex items-center justify-between border-b-2 border-slate-50 pb-4 mb-6">
                <CardTitle className="text-lg md:text-2xl font-black text-[#0F172A] uppercase">Registre des Matières</CardTitle>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-xl font-black text-primary">{subjects?.length || 0}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6 p-4 rounded-xl bg-slate-50 border-2 border-slate-100">
                <input placeholder="Matière" className="h-9 bg-white border-2 border-slate-200 rounded-lg px-3 text-[10px] font-black outline-none focus:border-primary" value={newSub.subject} onChange={e => setNewSub({...newSub, subject: e.target.value})} />
                <input placeholder="Niveau" className="h-9 bg-white border-2 border-slate-200 rounded-lg px-3 text-[10px] font-bold outline-none" value={newSub.level} onChange={e => setNewSub({...newSub, level: e.target.value})} />
                <input placeholder="Classe" className="h-9 bg-white border-2 border-slate-200 rounded-lg px-3 text-[10px] font-bold outline-none" value={newSub.gradeLevel} onChange={e => setNewSub({...newSub, gradeLevel: e.target.value.toUpperCase()})} />
                <input type="number" placeholder="Coeff" className="h-9 bg-white border-2 border-slate-200 rounded-lg text-center font-black text-sm text-primary" value={newSub.coeff} onChange={e => setNewSub({...newSub, coeff: e.target.value})} />
                <Button onClick={handleAddSubject} className="h-9 bg-accent hover:bg-slate-900 text-white font-black rounded-lg text-[9px] uppercase"><Plus className="w-3.5 h-3.5 mr-1" /> Ajouter</Button>
              </div>

              <div className="rounded-xl border-2 border-slate-50 overflow-hidden bg-white">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-none h-10">
                      <TableHead className="pl-6 text-white font-black uppercase text-[8px] tracking-widest">Matière</TableHead>
                      <TableHead className="text-center text-white font-black uppercase text-[8px] tracking-widest">Coeff</TableHead>
                      <TableHead className="text-right pr-6 text-white font-black uppercase text-[8px] tracking-widest">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingSubjects ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : subjects?.map((item: any) => (
                      <TableRow key={item.id} className="hover:bg-primary/5 transition-all border-b border-slate-50">
                        <TableCell className="pl-6 py-3 font-black text-[#0F172A] text-xs uppercase">{item.name}</TableCell>
                        <TableCell className="text-center py-3"><Badge className="bg-white text-primary font-black text-sm border-2 px-3">{item.coefficient}</Badge></TableCell>
                        <TableCell className="text-right pr-6 py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-destructive" onClick={() => handleDeleteSubject(item.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
