"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [userId, setUserId] = useState("DIR-001");
  const [password, setPassword] = useState("Admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const loginImage = PlaceHolderImages.find(img => img.id === "login-bg");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsLoading(true);

    try {
      if (userId === "DIR-001" && password === "Admin2026") {
        const userData = { id: userId, name: "Directeur Acadex", role: "DIRECTOR" };
        localStorage.setItem("acadex_user", JSON.stringify(userData));
        router.push("/dashboard");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.password === password) {
          const sessionData = { 
            id: userId, 
            name: userData.name || `${userData.firstName} ${userData.lastName}`,
            role: userData.role
          };
          localStorage.setItem("acadex_user", JSON.stringify(sessionData));
          router.push("/dashboard");
        } else {
          throw new Error("Mot de passe incorrect");
        }
      } else {
        throw new Error("Identifiant non reconnu.");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left - Vibrant Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#14532D]">
        <Image
          src={loginImage?.imageUrl || "https://picsum.photos/seed/acadex-students-uniform/1200/1200"}
          alt="Élèves ACADEX souriants"
          fill
          priority
          className="object-cover animate-pulse-slow transition-all duration-1000"
          data-ai-hint="African students school uniform smiling"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#14532D]/95 via-[#14532D]/40 to-transparent" />
        
        <div className="absolute inset-0 p-16 flex flex-col justify-between z-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-transform hover:rotate-6">
              <span className="text-[#14532D] font-bold text-2xl">A</span>
            </div>
            <h1 className="text-white font-headline font-bold text-4xl tracking-tight drop-shadow-xl">ACADEX</h1>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <div className="flex items-center gap-2 bg-accent/20 backdrop-blur-xl w-fit px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-white/30 text-white animate-pulse">
              <Sparkles className="w-4 h-4 text-white" /> Excellence Institutionnelle
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold text-white leading-[1.1] drop-shadow-2xl">
              L'excellence scolaire par l'innovation.
            </h2>
            <p className="text-2xl text-white/95 font-medium leading-relaxed drop-shadow-xl">
              Une plateforme SaaS premium conçue pour les établissements d'élite. Pilotez votre succès avec précision.
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="h-1.5 w-24 bg-accent rounded-full" />
            <div className="h-1.5 w-8 bg-white/30 rounded-full" />
            <span className="ml-4 text-xs font-bold text-white/70 uppercase tracking-widest">Session Académique 2024 / 2025</span>
          </div>
        </div>
      </div>

      {/* Right - Clean Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-4">
            <h1 className="text-5xl font-headline font-bold text-[#111827]">Accès Institutionnel</h1>
            <p className="text-slate-500 text-lg font-medium">Authentification sécurisée pour le personnel et les élèves.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Identifiant Unique</Label>
              <div className="relative group">
                <User className="absolute left-4 top-4.5 h-6 w-6 text-slate-300 group-focus-within:text-accent transition-colors" />
                <Input
                  placeholder="DIR-001, ENS-..."
                  className="pl-14 h-16 bg-slate-50 border-slate-200 rounded-[1.25rem] focus-visible:ring-2 focus-visible:ring-accent/20 transition-all text-base font-medium"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mot de passe</Label>
                <button type="button" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">Récupérer</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4.5 h-6 w-6 text-slate-300 group-focus-within:text-accent transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-14 pr-14 h-16 bg-slate-50 border-slate-200 rounded-[1.25rem] focus-visible:ring-2 focus-visible:ring-accent/20 transition-all text-base font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-5 text-slate-300 hover:text-[#111827] transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-lg font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-2xl shadow-accent/20 transition-all active:scale-95 rounded-[1.25rem]"
              disabled={isLoading}
            >
              {isLoading ? "Vérification..." : "Se connecter"} <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </form>

          <div className="pt-10 border-t border-slate-100 flex flex-col gap-8">
            <div className="flex items-center gap-6">
               <div className="h-px bg-slate-100 flex-1" />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Première connexion ?</span>
               <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Link href="/activate/student">
                <Button variant="outline" className="w-full h-14 border-slate-200 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors hover:border-accent p-2">Espace Élève</Button>
              </Link>
              <Link href="/setup/teacher">
                <Button variant="outline" className="w-full h-14 border-slate-200 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors hover:border-accent p-2">Enseignant</Button>
              </Link>
              <Link href="/setup/director">
                <Button variant="outline" className="w-full h-14 border-slate-200 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors hover:border-accent p-2">Direction</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}