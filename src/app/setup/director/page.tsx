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
        description: `Identifiant : ${directorId}`,
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/40" />

      <div className="relative z-10 w-full max-w-2xl animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-3 font-black uppercase tracking-[0.3em] text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <Card className="bg-white/95 backdrop-blur-3xl border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-8">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl flex items-center justify-center mb-5 shadow-xl rotate-3 border-4 border-white/20">
              <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] mb-2 tracking-tighter uppercase leading-none">Portail Direction</CardTitle>
            <CardDescription className="text-[#0F172A] font-black uppercase tracking-widest text-xs opacity-60">Configuration Maîtresse Élite</CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-12 pb-12">
            <form onSubmit={handleSetup} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Prénom</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A] group-focus-within:text-primary" />
                    <input 
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-12 h-14 rounded-xl font-black text-lg text-[#0F172A] outline-none focus:border-primary/40 shadow-inner" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Nom</Label>
                  <input 
                    className="w-full bg-slate-50 border-4 border-slate-100 h-14 rounded-xl font-black text-lg text-[#0F172A] px-6 outline-none shadow-inner" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Établissement</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]" />
                  <input 
                    className="w-full bg-slate-50 border-4 border-slate-100 pl-12 h-14 rounded-xl font-black text-lg text-[#0F172A] outline-none shadow-inner placeholder:text-[#0F172A]/30" 
                    placeholder="Nom de l'école..."
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-50">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]" />
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-4 border-slate-100 pl-12 h-14 rounded-xl font-black text-lg text-[#0F172A] outline-none shadow-inner" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A] ml-2">Confirmation</Label>
                  <input 
                    type="password"
                    className="w-full bg-slate-50 border-4 border-slate-100 h-14 rounded-xl font-black text-lg text-[#0F172A] px-6 outline-none shadow-inner" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full h-18 md:h-20 bg-primary hover:bg-slate-900 text-white font-black text-lg md:text-xl rounded-[1.5rem] md:rounded-[2rem] shadow-xl transition-all active:scale-95 flex gap-4 border-4 border-white/10" disabled={isLoading}>
                  <Save className="w-6 h-6 md:w-8 md:h-8" /> Valider l'Espace (DIR-001)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}