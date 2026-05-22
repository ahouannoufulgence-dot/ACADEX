"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Save, Building, Mail, Phone, Lock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const registrationImage = PlaceHolderImages.find(img => img.id === "dashboard-hero");

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
    <div className="min-h-screen relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-[#111827]">
      {/* Background Image with Overlay */}
      <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/600"}
        alt="Direction Visionnaire"
        fill
        priority
        className="object-cover opacity-40 animate-pulse-slow"
        data-ai-hint="happy African students school"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#14532D]/95 via-[#111827]/80 to-[#111827]/95" />

      <div className="relative z-10 w-full max-w-3xl animate-fade-up">
        <Link href="/login" className="mb-8 inline-flex items-center text-accent hover:text-white transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>

        <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="text-center pt-12 pb-10">
            <div className="mx-auto w-20 h-20 bg-[#14532D] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl transition-transform hover:scale-110">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-5xl font-headline font-bold text-white mb-3">Espace Direction</CardTitle>
            <CardDescription className="text-slate-300 font-medium text-lg">Configuration maîtresse de l'établissement</CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-16">
            <form onSubmit={handleSetup} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prénom du Directeur</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4.5 h-6 w-6 text-slate-400 group-focus-within:text-accent transition-colors" />
                    <Input 
                      className="bg-white/5 border-white/10 pl-14 h-16 rounded-2xl focus:ring-accent/20 text-lg" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom</Label>
                  <Input 
                    className="bg-white/5 border-white/10 h-16 rounded-2xl text-lg" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom de l'établissement d'élite</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-4.5 h-6 w-6 text-slate-400" />
                  <Input 
                    className="bg-white/5 border-white/10 pl-14 h-16 rounded-2xl text-lg" 
                    placeholder="Ex: Complexe Scolaire ACADEX Premium"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Officiel</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="email"
                      className="bg-white/5 border-white/10 pl-12 h-16 rounded-2xl" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Téléphone Direct</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
                    <Input 
                      className="bg-white/5 border-white/10 pl-12 h-16 rounded-2xl" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe Administrateur</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password"
                      className="bg-white/5 border-white/10 pl-12 h-16 rounded-2xl" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirmation de sécurité</Label>
                  <Input 
                    type="password"
                    className="bg-white/5 border-white/10 h-16 rounded-2xl" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full h-20 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-bold text-xl rounded-[1.5rem] shadow-2xl transition-all active:scale-95 flex gap-4" disabled={isLoading}>
                  <Save className="w-7 h-7" /> Valider et Générer mon ID (DIR-001)
                </Button>
                <p className="text-center mt-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <Sparkles className="inline-block w-4 h-4 mr-2 text-accent" /> Accès réservé aux directions d'établissements
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}