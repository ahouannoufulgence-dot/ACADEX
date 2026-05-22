
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
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-[#0F172A]">
       {/* Immersive Background */}
       <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-teacher/1400/1000"}
        alt="Enseignants ACADEX"
        fill
        priority
        className="object-cover opacity-40"
        data-ai-hint="happy teacher classroom"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-transparent to-[#0F172A]/90" />

      <div className="relative z-10 w-full max-w-4xl animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-blue-400 hover:text-white transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour au portail
        </Link>

        <Card className="bg-white/95 border-none shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar info */}
            <div className="lg:w-1/3 bg-blue-600 p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                  <GraduationCap size={200} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-headline font-bold leading-tight">Portail des Enseignants</h1>
                  <p className="text-blue-100 font-medium">Rejoignez l'élite pédagogique d'ACADEX et gérez vos classes en toute simplicité.</p>
               </div>
               <div className="relative z-10 pt-10">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  </div>
               </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-10 lg:p-14">
              <form onSubmit={handleSetup} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Informations Personnelles</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          placeholder="Ex: Jean"
                          className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10 font-medium" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Nom de famille</Label>
                      <Input 
                        placeholder="Ex: Kouassi"
                        className="h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10 font-medium" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 font-bold text-[10px] uppercase">Matière Spécialisée</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <Input 
                        placeholder="Ex: Mathématiques, SVT, Français..."
                        className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10 font-medium" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Contact & Sécurité</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Email Professionnel</Label>
                      <Input 
                        type="email"
                        placeholder="jean.kouassi@ecole.com"
                        className="h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10 font-medium" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          placeholder="+229 00 00 00 00"
                          className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10 font-medium" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          type="password"
                          className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold text-[10px] uppercase">Confirmation</Label>
                      <Input 
                        type="password"
                        className="h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-blue-500/10" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex gap-3" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : <><Save className="w-6 h-6" /> Finaliser mon Inscription</>}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
