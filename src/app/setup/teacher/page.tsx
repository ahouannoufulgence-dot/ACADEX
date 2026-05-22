"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, Save, Mail, Phone, Lock, User, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function TeacherSetupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
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
    
    try {
      const subjectCode = formData.subject.substring(0, 4).toUpperCase() || "GEN";
      const randomId = Math.floor(Math.random() * 900) + 100;
      const teacherId = `ENS-${subjectCode}-${randomId}`;
      
      const userRef = doc(db, "users", teacherId);
      await setDoc(userRef, {
        id: teacherId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `M. ${formData.lastName}`,
        subject: formData.subject,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "TEACHER",
        status: "Actif",
        createdAt: serverTimestamp()
      });

      toast({
        title: "Espace Enseignant activé",
        description: `Votre identifiant est : ${teacherId}`,
      });
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de créer le compte." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-[#F0F7FF]">
       {/* Immersive Background */}
       <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-teacher/1400/1000"}
        alt="Enseignants ACADEX"
        fill
        priority
        className="object-cover opacity-80 saturate-[1.6]"
        data-ai-hint="happy teacher classroom"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-[#F0F7FF]/50" />

      <div className="relative z-10 w-full max-w-5xl animate-fade-up">
        <Link href="/login" className="mb-8 inline-flex items-center text-[#14532D] hover:text-black transition-colors gap-2 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour au portail
        </Link>

        <Card className="bg-white/95 border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.3)] rounded-[3rem] overflow-hidden backdrop-blur-xl flex flex-col lg:flex-row">
            {/* Sidebar info */}
            <div className="lg:w-[35%] bg-primary p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                  <GraduationCap size={250} />
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-6">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-headline font-black leading-none tracking-tighter uppercase">Portail<br/>Enseignants</h1>
                  <p className="text-white/80 font-bold text-xl leading-snug">Rejoignez l'élite pédagogique d'ACADEX et gérez vos classes en toute clarté.</p>
               </div>
               <div className="relative z-10 pt-10 flex gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
               </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-12 lg:p-16">
              <form onSubmit={handleSetup} className="space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-primary">
                    <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Identité Professionnelle</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Prénom</Label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Ex: Jean"
                          className="pl-16 h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-xl text-[#0F172A] focus:border-primary/30" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Nom de famille</Label>
                      <Input 
                        placeholder="Ex: Kouassi"
                        className="h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-xl text-[#0F172A] px-8" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Matière Spécialisée</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                      <Input 
                        placeholder="Ex: Mathématiques, SVT, Français..."
                        className="pl-16 h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-xl text-[#0F172A]" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pt-6 border-t-4 border-slate-50">
                   <div className="flex items-center gap-4 text-primary">
                    <Mail className="w-6 h-6 text-accent" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Sécurité & Contact</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Email Professionnel</Label>
                      <Input 
                        type="email"
                        placeholder="jean.kouassi@ecole.com"
                        className="h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-lg text-[#0F172A] px-8" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                        <Input 
                          placeholder="+229 00 00 00 00"
                          className="pl-16 h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-lg text-[#0F172A]" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                        <Input 
                          type="password"
                          className="pl-16 h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-xl text-[#0F172A]" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest ml-1">Confirmation</Label>
                      <Input 
                        type="password"
                        className="h-18 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-xl text-[#0F172A] px-8" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full h-20 bg-primary hover:bg-slate-900 text-white font-black text-2xl rounded-[2rem] shadow-2xl transition-all active:scale-95 flex gap-6 border-4 border-white/10" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : <><Save className="w-8 h-8" /> Activer mon Espace</>}
                </Button>
              </form>
            </div>
        </Card>
      </div>
    </div>
  );
}