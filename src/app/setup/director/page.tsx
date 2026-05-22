
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Save, Building, Mail, Phone, Lock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const registrationImage = PlaceHolderImages.find(img => img.id === "login-bg");

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsLoading(true);
    const directorId = "DIR-001";
    
    try {
      const userRef = doc(db, "users", directorId);
      await setDoc(userRef, {
        id: directorId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `Directeur ${formData.lastName}`,
        schoolName: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "DIRECTOR",
        status: "Actif",
        createdAt: serverTimestamp()
      });

      toast({
        title: "Espace Directeur créé",
        description: `Votre identifiant de connexion est : ${directorId}`,
      });
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de créer le compte." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-white">
      <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"}
        alt="Élèves ACADEX concentrés et joyeux"
        fill
        priority
        className="object-cover opacity-90 saturate-[1.8]"
        data-ai-hint="happy students concentration"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/30" />

      <div className="relative z-10 w-full max-w-3xl animate-fade-up">
        <Link href="/login" className="mb-8 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-3 font-black uppercase tracking-[0.3em] text-[11px]">
          <ArrowLeft className="w-5 h-5" /> Retour à la connexion
        </Link>

        <Card className="bg-white/95 backdrop-blur-3xl border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.4)] rounded-[3rem] overflow-hidden">
          <CardHeader className="text-center pt-12 pb-10">
            <div className="mx-auto w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl rotate-3 border-4 border-white/20">
              <ShieldCheck className="w-14 h-14 text-white" />
            </div>
            <CardTitle className="text-5xl font-headline font-black text-[#0F172A] mb-3 tracking-tighter uppercase">Espace Direction</CardTitle>
            <CardDescription className="text-[#0F172A] font-black uppercase tracking-widest text-sm opacity-60">Configuration Maîtresse Élite</CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-16">
            <form onSubmit={handleSetup} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Prénom du Directeur</Label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0F172A]/40 group-focus-within:text-primary transition-colors" />
                    <input 
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-16 h-18 rounded-2xl font-black text-xl text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Nom de famille</Label>
                  <input 
                    className="w-full bg-slate-50 border-4 border-slate-100 h-18 rounded-2xl font-black text-xl text-[#0F172A] px-8 outline-none focus:border-primary/40 shadow-inner" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Nom de l'établissement</Label>
                <div className="relative">
                  <Building className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0F172A]/40" />
                  <input 
                    className="w-full bg-slate-50 border-4 border-slate-100 pl-16 h-18 rounded-2xl font-black text-xl text-[#0F172A] outline-none focus:border-primary/40 shadow-inner placeholder:text-[#0F172A]/20" 
                    placeholder="Ex: Complexe Scolaire ACADEX Premium"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Email Officiel</Label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0F172A]/40" />
                    <input 
                      type="email"
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-16 h-18 rounded-2xl font-black text-lg text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0F172A]/40" />
                    <input 
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-16 h-18 rounded-2xl font-black text-lg text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t-4 border-slate-50">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Mot de passe Admin</Label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0F172A]/40" />
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-16 h-18 rounded-2xl font-black text-xl text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Confirmation</Label>
                  <input 
                    type="password"
                    className="w-full bg-slate-50 border-4 border-slate-100 h-18 rounded-2xl font-black text-xl text-[#0F172A] px-8 outline-none focus:border-primary/40 shadow-inner" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="pt-8">
                <Button className="w-full h-24 bg-primary hover:bg-slate-900 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex gap-8 border-4 border-white/10" disabled={isLoading}>
                  <Save className="w-10 h-10" /> Valider l'Espace (DIR-001)
                </Button>
                <div className="flex items-center justify-center gap-4 mt-10">
                   <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                   <p className="text-[11px] text-[#0F172A] font-black uppercase tracking-[0.4em]">Accès réservé aux directions d'établissements</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
