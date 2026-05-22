
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-hidden bg-[#111827]">
      {/* Background Image */}
      <Image
        src={loginImage?.imageUrl || "https://picsum.photos/seed/acadex-students-uniform/1200/1200"}
        alt="Élèves ACADEX"
        fill
        priority
        className="object-cover opacity-70 animate-pulse-slow"
        data-ai-hint="African students school uniform smiling"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#14532D]/90 via-[#111827]/40 to-[#111827]/80" />
      
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Hidden on Mobile */}
        <div className="hidden lg:flex flex-col space-y-10 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-[#14532D] font-black text-4xl">A</span>
            </div>
            <h1 className="text-white font-headline font-bold text-6xl tracking-tighter drop-shadow-2xl">ACADEX</h1>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-accent/40 backdrop-blur-xl w-fit px-8 py-3 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase border border-white/20 text-white animate-pulse">
              <Sparkles className="w-5 h-5 text-white" /> Excellence Éducative
            </div>
            <h2 className="text-7xl font-headline font-bold text-white leading-[1.1] drop-shadow-2xl">
              L'avenir commence <span className="text-accent">ici</span>.
            </h2>
            <p className="text-2xl text-white/95 font-medium leading-relaxed drop-shadow-xl max-w-lg">
              Pilotez votre réussite avec la plateforme la plus avancée du Bénin.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="glass-card border-white/10 shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-3xl bg-white/10 animate-fade-up">
          <CardContent className="p-8 md:p-14 space-y-8 md:space-y-10">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight">Accès Institutionnel</h3>
              <p className="text-slate-300 text-sm md:text-base font-medium">Authentification sécurisée Élite.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identifiant Unique</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <Input
                    placeholder="DIR-001..."
                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-accent/20 text-white"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-12 pr-12 h-14 bg-white/5 border-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-accent/20 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-[#14532D] hover:bg-[#1a6b3a] text-white rounded-xl gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Se connecter"} <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <span className="block text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Première connexion ?</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Link href="/activate/student">
                  <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white text-[9px] uppercase tracking-tighter">Élève</Button>
                </Link>
                <Link href="/setup/teacher">
                  <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white text-[9px] uppercase tracking-tighter">Enseignant</Button>
                </Link>
                <Link href="/setup/director">
                  <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white text-[9px] uppercase tracking-tighter">Direction</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
