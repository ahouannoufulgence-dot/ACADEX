"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function LoginPage() {
  const [userId, setUserId] = useState("DIR-001");
  const [password, setPassword] = useState("Admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

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
          const sessionData = { id: userId, name: userData.name || `${userData.firstName} ${userData.lastName}` };
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
      {/* Left - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#14532D]">
        <Image
          src="https://picsum.photos/seed/acadex-campus/1200/1200"
          alt="Campus Excellence"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 p-24 flex flex-col justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-[#14532D] font-bold text-2xl">A</span>
            </div>
            <h1 className="text-white font-headline font-bold text-3xl tracking-tight">ACADEX</h1>
          </div>
          <div className="space-y-8">
            <h2 className="text-6xl font-headline font-bold text-white leading-tight">
              Le futur de l'éducation se construit ici.
            </h2>
            <div className="flex gap-4">
              <div className="h-1 w-12 bg-white/40 rounded-full" />
              <div className="h-1 w-4 bg-white/20 rounded-full" />
              <div className="h-1 w-4 bg-white/20 rounded-full" />
            </div>
          </div>
          <p className="text-white/60 font-medium max-w-sm">
            Plateforme de gestion scolaire premium conçue pour l'excellence académique en Afrique.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-3">
            <h1 className="text-4xl font-headline font-bold text-slate-900">Bon retour.</h1>
            <p className="text-slate-500 font-medium">Connectez-vous à votre espace institutionnel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identifiant</Label>
              <div className="relative group">
                <User className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
                <Input
                  placeholder="DIR-001, ENS-..."
                  className="pl-12 h-14 bg-white border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-[#14532D]/20"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-12 pr-12 h-14 bg-white border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-[#14532D]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-lg transition-transform hover:scale-[1.01] rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Vérification..." : "Se connecter"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="pt-10 flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Nouveau sur Acadex ?</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/setup/director" className="flex-1">
                <Button variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-xs font-bold">Directeur</Button>
              </Link>
              <Link href="/activate/student" className="flex-1">
                <Button variant="outline" className="w-full h-12 border-slate-200 rounded-xl text-xs font-bold">Élève/Parent</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
