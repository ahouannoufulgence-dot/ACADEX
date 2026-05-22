"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, Save, Mail, Phone, Lock, User, BookOpen, Sparkles } from "lucide-react";
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
    <div className="min-h-screen relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-[#111827]">
       {/* Background Image with Overlay */}
       <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-students-uniform/1200/1200"}
        alt="Enseignants joyeux"
        fill
        priority
        className="object-cover opacity-60 animate-pulse-slow"
        data-ai-hint="happy African students classroom"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#14532D]/95 via-[#111827]/60 to-[#111827]/90" />

      <div className="relative z-10 w-full max-w-2xl animate-fade-up">
        <Link href="/login" className="mb-8 inline-flex items-center text-accent hover:text-white transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>

        <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-2xl transition-transform hover:-rotate-3">
              <Users className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-headline font-bold text-white mb-2">Espace Enseignant</CardTitle>
            <CardDescription className="text-slate-300 font-medium">Rejoignez le corps professoral d'ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-16">
            <form onSubmit={handleSetup} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prénom</Label>
                  <Input 
                    className="bg-white/5 border-white/10 h-14 rounded-xl focus:ring-blue-500/20" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom</Label>
                  <Input 
                    className="bg-white/5 border-white/10 h-14 rounded-xl" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Matière Enseignée</Label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-4.5 h-6 w-6 text-slate-400" />
                  <Input 
                    className="bg-white/5 border-white/10 pl-14 h-14 rounded-xl" 
                    placeholder="Ex: Mathématiques, Physique..."
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <Input 
                      type="email"
                      className="bg-white/5 border-white/10 pl-12 h-14 rounded-xl" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <Input 
                      className="bg-white/5 border-white/10 pl-12 h-14 rounded-xl" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password"
                      className="bg-white/5 border-white/10 pl-12 h-14 rounded-xl" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirmation</Label>
                  <Input 
                    type="password"
                    className="bg-white/5 border-white/10 h-14 rounded-xl" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all active:scale-95 flex gap-3" disabled={isLoading}>
                <Save className="w-6 h-6" /> Valider mon inscription
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}