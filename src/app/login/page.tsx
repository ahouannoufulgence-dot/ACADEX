
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
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-[#111827]">
      {/* Background Image - Happy Students */}
      <Image
        src={loginImage?.imageUrl || "https://picsum.photos/seed/acadex-students-uniform/1200/1200"}
        alt="Élèves ACADEX rayonnants"
        fill
        priority
        className="object-cover opacity-70 animate-pulse-slow"
        data-ai-hint="African students school uniform smiling"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#14532D]/90 via-[#111827]/50 to-[#111827]/80" />
      
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Inspirational Content */}
        <div className="hidden lg:flex flex-col space-y-10 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:rotate-6">
              <span className="text-[#14532D] font-black text-3xl">A</span>
            </div>
            <h1 className="text-white font-headline font-bold text-5xl tracking-tighter drop-shadow-2xl">ACADEX</h1>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-accent/30 backdrop-blur-xl w-fit px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-white/20 text-white animate-pulse">
              <Sparkles className="w-5 h-5 text-white" /> Excellence Éducative
            </div>
            <h2 className="text-6xl font-headline font-bold text-white leading-[1.1] drop-shadow-2xl">
              L'avenir commence <span className="text-accent">ici</span>.
            </h2>
            <p className="text-2xl text-white/90 font-medium leading-relaxed drop-shadow-xl max-w-lg">
              Pilotez votre réussite avec la plateforme la plus avancée du Bénin. Précision, Joie et Innovation.
            </p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="h-1 w-24 bg-accent rounded-full" />
            <div className="h-1 w-12 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Right Side - Floating Glass Form */}
        <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden backdrop-blur-3xl bg-white/10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-10 lg:p-14 space-y-10">
            <div className="space-y-3">
              <h3 className="text-4xl font-headline font-bold text-white tracking-tight">Accès Institutionnel</h3>
              <p className="text-slate-300 font-medium">Authentification sécurisée Élite.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identifiant Unique</Label>
                <div className="relative group">
                  <User className="absolute left-5 top-5 h-6 w-6 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <Input
                    placeholder="DIR-001, ENS-..."
                    className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent/20 transition-all text-white text-lg font-medium"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</Label>
                  <button type="button" className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">Récupérer</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-5 h-6 w-6 text-slate-400 group-focus-within:text-accent transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-14 pr-14 h-16 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent/20 transition-all text-white text-lg font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-bold bg-[#14532D] hover:bg-[#1a6b3a] text-white shadow-2xl transition-all active:scale-95 rounded-2xl gap-3"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Se connecter"} <ArrowRight className="w-6 h-6" />
              </Button>
            </form>

            <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
              <span className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Première connexion ?</span>
              <div className="grid grid-cols-3 gap-3">
                <Link href="/activate/student">
                  <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 text-[9px] font-bold uppercase tracking-tighter">Élève</Button>
                </Link>
                <Link href="/setup/teacher">
                  <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 text-[9px] font-bold uppercase tracking-tighter">Enseignant</Button>
                </Link>
                <Link href="/setup/director">
                  <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 text-[9px] font-bold uppercase tracking-tighter">Direction</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
