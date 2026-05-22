"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, GraduationCap, Users, Sparkles } from "lucide-react";
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
        const userData = { 
          id: userId, 
          name: "Directeur Acadex",
          role: "DIRECTOR"
        };
        localStorage.setItem("acadex_user", JSON.stringify(userData));
        
        addDoc(collection(db, "auditLogs"), {
          userId,
          userName: "Directeur Acadex",
          action: "Connexion réussie",
          timestamp: serverTimestamp(),
          details: "Accès administrateur principal"
        }).catch(() => {});

        toast({ title: "Accès autorisé", description: "Bienvenue sur le système ACADEX." });
        router.push("/dashboard");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.status === "Suspendu") {
          throw new Error("Ce compte a été suspendu par la direction.");
        }

        if (userData.password === password) {
          const sessionData = { 
            id: userId, 
            name: userData.name || `${userData.firstName} ${userData.lastName}`,
          };
          localStorage.setItem("acadex_user", JSON.stringify(sessionData));
          
          updateDoc(doc(db, "users", userId), { lastLogin: serverTimestamp() }).catch(() => {});

          addDoc(collection(db, "auditLogs"), {
            userId,
            userName: sessionData.name,
            action: "Connexion réussie",
            timestamp: serverTimestamp(),
            details: `Rôle: ${userData.role}`
          }).catch(() => {});

          toast({ title: "Connexion réussie", description: `Bienvenue, ${userData.name || userData.firstName}.` });
          router.push("/dashboard");
        } else {
          addDoc(collection(db, "auditLogs"), {
            userId,
            action: "Échec de connexion",
            timestamp: serverTimestamp(),
            details: "Mot de passe incorrect"
          }).catch(() => {});
          throw new Error("Mot de passe incorrect");
        }
      } else {
        throw new Error("Identifiant non reconnu ou compte non activé.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgImage = PlaceHolderImages.find(img => img.id === "login-bg");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B0F1A]">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-bg/1920/1080"}
          alt="School ambiance"
          fill
          priority
          className="object-cover opacity-20 grayscale brightness-50"
          data-ai-hint="happy African students"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#0B0F1A]/95 to-[#14532D]/20" />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center gap-20 px-8">
        <div className="flex-1 space-y-12 animate-in slide-in-from-left duration-700">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-[#14532D] rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border border-white/10">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-8xl font-headline font-bold text-white tracking-tighter leading-none mb-6">ACADEX</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-md leading-relaxed">
                Le futur de l'éducation se construit <span className="text-[#14532D] font-bold">avec vous</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
            <Link href="/setup/director">
              <Button variant="outline" className="w-full justify-start h-20 bg-white/5 border-white/10 shadow-sm hover:border-[#14532D] hover:bg-white/10 text-white group rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-[#14532D]/20 flex items-center justify-center mr-4 group-hover:bg-[#14532D] transition-colors">
                  <KeyRound className="w-6 h-6 text-[#14532D] group-hover:text-white" />
                </div>
                <span className="font-bold">Directeur</span>
              </Button>
            </Link>

            <Link href="/setup/teacher">
              <Button variant="outline" className="w-full justify-start h-20 bg-white/5 border-white/10 shadow-sm hover:border-[#14532D] hover:bg-white/10 text-white group rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:bg-[#14532D] transition-colors">
                  <Users className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <span className="font-bold">Enseignant</span>
              </Button>
            </Link>

            <Link href="/activate/student" className="sm:col-span-2">
              <Button variant="outline" className="w-full justify-start h-20 bg-[#14532D] hover:bg-[#166534] text-white border-none shadow-xl group rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold block leading-none mb-1">Espace Élève / Parent</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-70">Activation avec code direction</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <Card className="w-full max-w-md premium-card border-white/10 shadow-2xl animate-in slide-in-from-right duration-700">
          <CardHeader className="text-center pt-12 pb-10">
            <CardTitle className="text-3xl font-headline font-bold text-white">Connexion</CardTitle>
            <CardDescription className="font-medium text-slate-500">Accès sécurisé institutionnel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 px-12 pb-16">
            <form onSubmit={handleLogin} className="space-y-7">
              <div className="space-y-3">
                <Label htmlFor="userId" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-1">Identifiant unique</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#14532D] transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="userId"
                    placeholder="DIR-001, ENS-..., ELV-..."
                    className="pl-12 bg-white/5 border-white/5 text-white font-bold h-14 rounded-xl focus-visible:ring-2 focus-visible:ring-[#14532D]/20"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Mot de passe</Label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#14532D] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-12 pr-12 bg-white/5 border-white/5 text-white font-bold h-14 rounded-xl focus-visible:ring-2 focus-visible:ring-[#14532D]/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-15 text-lg font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-xl transition-all active:scale-[0.98] rounded-xl border border-white/10"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Se connecter"}
              </Button>
            </form>

            <div className="pt-6 text-center">
               <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10">
                <Sparkles className="w-3 h-3 text-[#14532D]" />
                Elite Educational Software
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
