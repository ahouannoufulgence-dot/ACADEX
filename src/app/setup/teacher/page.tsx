
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, Save, Lock, User, BookOpen, Sparkles, Loader2, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function TeacherSetupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const registrationImage = PlaceHolderImages.find(img => img.id === "login-bg");

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || isLoading) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsLoading(true);
    setProgress(20);
    console.log("ACADEX: Création Enseignant démarrée");

    // Génération d'ID instantanée (Optimiste)
    const subjectCode = formData.subject.substring(0, 4).toUpperCase() || "GEN";
    const randomId = Math.floor(Math.random() * 900) + 100;
    const teacherId = `ENS-${subjectCode}-${randomId}`;
    setGeneratedId(teacherId);
    setProgress(60);
    console.log(`ACADEX: Identifiant généré ${teacherId}`);

    const userRef = doc(db, "users", teacherId);
    const userData = {
      id: teacherId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `M. ${formData.lastName}`,
      subject: formData.subject,
      password: formData.password,
      role: "TEACHER",
      status: "Actif",
      createdAt: serverTimestamp()
    };

    // Écriture spontanée sans await
    setDoc(userRef, userData)
      .then(() => {
        console.log("ACADEX: Firestore sauvegardé");
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    // Finalisation immédiate
    setTimeout(() => {
      setProgress(100);
      console.log("ACADEX: Terminé");
      toast({ title: "Compte enseignant créé", description: `ID: ${teacherId}` });
      setTimeout(() => router.push("/login"), 500);
    }, 400);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-white">
       <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"}
        alt="Enseignants ACADEX"
        fill
        priority
        className="object-cover opacity-90 saturate-[1.8]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/40" />

      <div className="relative z-10 w-full max-w-4xl animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour
        </Link>

        <Card className="bg-white/95 backdrop-blur-3xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-[30%] bg-primary p-8 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                  <GraduationCap size={100} />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-xl rotate-6">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h1 className="text-xl font-headline font-black tracking-tighter uppercase leading-none">Espace Profs</h1>
                  <p className="text-white font-black text-[10px] opacity-90">Session 2026-2027</p>
               </div>
            </div>

            <div className="flex-1 p-8 md:p-10">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-12 space-y-6">
                   <div className="relative w-16 h-16">
                     <Loader2 className="w-16 h-16 text-primary animate-spin" />
                   </div>
                   <div className="w-full max-w-md space-y-4">
                     <div className="flex justify-between items-end">
                       <p className="text-[9px] font-black text-[#0F172A] uppercase tracking-widest">
                         Création du compte...
                       </p>
                       <span className="text-xs font-black text-primary">{progress}%</span>
                     </div>
                     <Progress value={progress} className="h-1.5" />
                     {generatedId && (
                        <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-100 flex items-center justify-between animate-in zoom-in-95 duration-300">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-xl font-black text-primary font-mono">{generatedId}</span>
                        </div>
                     )}
                   </div>
                </div>
              ) : (
                <form onSubmit={handleSetup} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#0F172A]">Identité</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[#0F172A] font-black text-[9px] uppercase ml-1">Prénom</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0F172A] opacity-40" />
                          <Input 
                            className="pl-11 h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-base text-[#0F172A]" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[#0F172A] font-black text-[9px] uppercase ml-1">Nom</Label>
                        <Input 
                          className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-base text-[#0F172A] px-5" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#0F172A] font-black text-[9px] uppercase ml-1">Matière</Label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0F172A] opacity-40" />
                        <Input 
                          placeholder="Ex: Mathématiques"
                          className="pl-11 h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-base text-[#0F172A]" 
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-slate-50">
                    <div className="space-y-1.5">
                      <Label className="text-[#0F172A] font-black text-[9px] uppercase ml-1">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0F172A] opacity-40" />
                        <Input 
                          type="password"
                          className="pl-11 h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-base text-[#0F172A]" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#0F172A] font-black text-[9px] uppercase ml-1">Confirmation</Label>
                      <Input 
                        type="password"
                        className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-base text-[#0F172A] px-5" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <Button className="w-full h-16 bg-primary hover:bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex gap-3 border-2 border-white/10" disabled={isLoading}>
                    <Save className="w-5 h-5" /> Activer l'Espace Prof
                  </Button>
                </form>
              )}
            </div>
        </Card>
      </div>
    </div>
  );
}
