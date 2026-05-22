
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowRight, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        const userData = { id: userId, name: "Directeur ACADEX", role: "DIRECTOR" };
        localStorage.setItem("acadex_user", JSON.stringify(userData));
        router.push("/dashboard");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.password === password) {
          if (userData.status === "Suspendu") {
            throw new Error("Votre compte est suspendu. Contactez la direction.");
          }
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
        throw new Error("Identifiant non reconnu. Veuillez activer votre compte.");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur de connexion", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#F0F7FF]">
      <Image
        src={loginImage?.imageUrl || "https://picsum.photos/seed/acadex-study-group/1400/1000"}
        alt="Élèves ACADEX au travail"
        fill
        priority
        className="object-cover transition-opacity duration-1000 opacity-80 saturate-[1.6]"
        data-ai-hint="students studying"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-white/60" />

      <div className="relative z-10 w-full max-w-[480px] animate-fade-up">
        <Card className="bg-white/95 backdrop-blur-2xl border-none shadow-[0_40px_120px_rgba(0,0,0,0.3)] rounded-[3rem] overflow-hidden">
          <CardContent className="p-10 lg:p-14 text-center space-y-10">
            
            <div className="space-y-6">
              <div className="mx-auto w-24 h-24 relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl border-4 border-slate-50 p-4 flex flex-col items-center justify-center gap-1">
                      <GraduationCap className="w-10 h-10 text-primary" />
                      <div className="flex gap-1">
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                      </div>
                  </div>
              </div>
              <div>
                  <h1 className="text-5xl font-headline font-black text-[#0F172A] tracking-tighter">
                      ACADEX
                  </h1>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-2">Gestion Scolaire Élite</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identifiant Personnel</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      placeholder="Ex: DIR-001"
                      className="w-full pl-12 h-14 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:border-primary/30 outline-none text-[#0F172A] font-black uppercase tracking-widest shadow-inner"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 h-14 bg-slate-50 border-4 border-slate-100 rounded-2xl focus:border-primary/30 outline-none text-[#0F172A] font-black shadow-inner"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-lg font-black bg-primary hover:bg-slate-900 text-white rounded-2xl shadow-2xl transition-all active:scale-95 flex gap-3 border-4 border-white/10"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Se connecter <ArrowRight className="w-6 h-6" /></>}
              </Button>
            </form>

            <div className="pt-8 border-t-4 border-slate-50 grid grid-cols-3 gap-4">
              <Link href="/activate/student" className="text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">Élève</Link>
              <Link href="/setup/teacher" className="text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">Enseignant</Link>
              <Link href="/setup/director" className="text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">Direction</Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
