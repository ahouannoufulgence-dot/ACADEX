
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Save, Building, Lock, User, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function DirectorSetupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    schoolName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
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
    
    // Génération instantanée de l'ID
    const directorId = "DIR-001";
    setGeneratedId(directorId);
    setProgress(50);

    const userRef = doc(db, "users", directorId);
    const userData = {
      id: directorId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `Directeur ${formData.lastName}`,
      schoolName: formData.schoolName,
      password: formData.password,
      role: "DIRECTOR",
      status: "Actif",
      createdAt: serverTimestamp()
    };

    // Timeout de sécurité
    const timer = setTimeout(() => {
      setIsSlow(true);
    }, 5000);

    // Écriture non-bloquante (Spontanée)
    setDoc(userRef, userData)
      .then(() => {
        clearTimeout(timer);
        setProgress(100);
        toast({ title: "Identifiant généré : DIR-001", description: "Espace Direction activé spontanément." });
        setTimeout(() => router.push("/login"), 800);
      })
      .catch(async () => {
        clearTimeout(timer);
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-white">
      <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"}
        alt="Élèves ACADEX"
        fill
        priority
        className="object-cover opacity-90 saturate-[1.8]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/40" />

      <div className="relative z-10 w-full max-w-2xl animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour
        </Link>

        <Card className="bg-white/95 backdrop-blur-3xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl rotate-3 border-2 border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Portail Direction</CardTitle>
            <CardDescription className="text-[#0F172A] font-black uppercase tracking-widest text-[10px] opacity-60">Configuration 2026-2027</CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-12 pb-10">
            {isLoading ? (
              <div className="py-12 space-y-8 flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <Loader2 className="w-20 h-20 text-primary animate-spin absolute" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Save className="w-8 h-8 text-primary/30" />
                  </div>
                </div>
                <div className="w-full max-w-sm space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">
                      {isSlow ? "Connexion lente, nouvel essai..." : "Création du compte..."}
                    </p>
                    <span className="text-xs font-black text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-100" />
                  {generatedId && (
                    <div className="p-4 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-3">
                         <CheckCircle2 className="w-5 h-5 text-primary" />
                         <span className="text-[10px] font-black text-[#0F172A] uppercase">ID Généré</span>
                       </div>
                       <span className="text-lg font-black text-primary font-mono">{generatedId}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSetup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F172A] ml-2">Prénom</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] opacity-40" />
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 pl-11 h-12 rounded-xl font-black text-base text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F172A] ml-2">Nom</Label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-base text-[#0F172A] px-5 outline-none shadow-inner" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F172A] ml-2">Établissement</Label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] opacity-40" />
                    <input 
                      className="w-full bg-slate-50 border-2 border-slate-100 pl-11 h-12 rounded-xl font-black text-base text-[#0F172A] outline-none shadow-inner" 
                      placeholder="Nom de l'école..."
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-slate-50">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F172A] ml-2">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] opacity-40" />
                      <input 
                        type="password"
                        className="w-full bg-slate-50 border-2 border-slate-100 pl-11 h-12 rounded-xl font-black text-base text-[#0F172A] outline-none shadow-inner" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F172A] ml-2">Confirmation</Label>
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-2 border-slate-100 h-12 rounded-xl font-black text-base text-[#0F172A] px-5 outline-none shadow-inner" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-16 bg-primary hover:bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex gap-3 border-2 border-white/10" disabled={isLoading}>
                    <Save className="w-5 h-5" /> Valider l'Espace (DIR-001)
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
