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
        description: `Identifiant : ${teacherId}`,
      });
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de créer le compte." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-white">
       <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"}
        alt="Élèves ACADEX concentrés et joyeux"
        fill
        priority
        className="object-cover opacity-90 saturate-[1.8]"
        data-ai-hint="happy students concentration"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/40" />

      <div className="relative z-10 w-full max-w-4xl animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-3 font-black uppercase tracking-[0.3em] text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <Card className="bg-white/95 backdrop-blur-3xl border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden flex flex-col lg:row">
            <div className="lg:w-[30%] bg-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <GraduationCap size={150} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tighter uppercase leading-none">Espace Profs</h1>
                  <p className="text-white font-black text-base opacity-90">Rejoignez l'élite pédagogique.</p>
               </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
              <form onSubmit={handleSetup} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F172A]">Identité</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase ml-1">Prénom</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]" />
                        <Input 
                          placeholder="Jean"
                          className="pl-12 h-14 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-lg text-[#0F172A]" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#0F172A] font-black text-[10px] uppercase ml-1">Nom</Label>
                      <Input 
                        placeholder="Kouassi"
                        className="h-14 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-lg text-[#0F172A] px-6" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#0F172A] font-black text-[10px] uppercase ml-1">Matière</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]" />
                      <Input 
                        placeholder="Mathématiques..."
                        className="pl-12 h-14 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-lg text-[#0F172A]" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-50">
                  <div className="space-y-2">
                    <Label className="text-[#0F172A] font-black text-[10px] uppercase ml-1">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]" />
                      <Input 
                        type="password"
                        className="pl-12 h-14 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-lg text-[#0F172A]" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#0F172A] font-black text-[10px] uppercase ml-1">Confirmation</Label>
                    <Input 
                      type="password"
                      className="h-14 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-lg text-[#0F172A] px-6" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <Button className="w-full h-18 md:h-20 bg-primary hover:bg-slate-900 text-white font-black text-lg md:text-xl rounded-[1.5rem] md:rounded-[2rem] shadow-xl transition-all active:scale-95 flex gap-4 border-4 border-white/10" disabled={isLoading}>
                  {isLoading ? "Envoi..." : <><Save className="w-6 h-6 md:w-8 md:h-8" /> Activer l'Espace</>}
                </Button>
              </form>
            </div>
        </Card>
      </div>
    </div>
  );
}