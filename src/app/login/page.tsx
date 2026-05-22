
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles, QrCode, GraduationCap, BookOpen } from "lucide-react";
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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#F0F7FF]">
      {/* Background Image with optimized rendering */}
      <Image
        src={loginImage?.imageUrl || "https://images.unsplash.com/photo-1523050853064-8504f2f40fd5?q=80&w=2070&auto=format&fit=crop"}
        alt="Élèves EduTrack Pro"
        fill
        priority
        className="object-cover transition-opacity duration-1000"
        data-ai-hint="happy students classroom"
      />
      
      {/* Gradient Overlay to match the screenshot style */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F0F7FF]/20 to-[#F0F7FF]/60 lg:to-[#F0F7FF]/40" />
      
      {/* Motivational Text in background (hidden on small mobile) */}
      <div className="absolute top-20 left-1/3 hidden lg:block animate-fade-up">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 space-y-2 text-center">
            <p className="text-[#10B981] font-bold text-xl uppercase tracking-tighter">Apprendre</p>
            <p className="text-[#F59E0B] font-bold text-xl uppercase tracking-tighter">Aujourd'hui</p>
            <p className="text-[#3B82F6] font-bold text-xl uppercase tracking-tighter">Réussir</p>
            <p className="text-[#8B5CF6] font-bold text-xl uppercase tracking-tighter">Demain</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-end">
        
        {/* Right Side - Branding & Login Card */}
        <div className="w-full max-w-[480px] animate-fade-up">
          <Card className="bg-white border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 lg:p-12 text-center space-y-8">
              
              {/* Logo Section */}
              <div className="space-y-4">
                <div className="mx-auto w-24 h-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#166534] to-[#10B981] rounded-3xl rotate-6 opacity-10"></div>
                    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center gap-1">
                        <GraduationCap className="w-10 h-10 text-[#0062CC]" />
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                            <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-headline font-bold text-[#1E293B] flex items-center justify-center gap-2">
                        EduTrack <span className="text-[#10B981]">Pro</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Gestion Scolaire Intelligente</p>
                </div>
              </div>

              {/* Form Header */}
              <div className="space-y-2 pt-2 border-t border-slate-50 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                    <GraduationCap className="w-5 h-5 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold text-[#334155]">Portail d'accès sécurisé</h2>
                <p className="text-slate-400 text-xs">Connectez-vous pour accéder à votre espace</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5 text-left">
                <div className="space-y-1">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0062CC] transition-colors" />
                    <Input
                      placeholder="Identifiant Unique"
                      className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-2 focus-visible:ring-[#0062CC]/10 text-slate-700 placeholder:text-slate-300"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0062CC] transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      className="pl-12 pr-12 h-14 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-2 focus-visible:ring-[#0062CC]/10 text-slate-700 placeholder:text-slate-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#334155] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="text-right pt-1">
                    <Link href="#" className="text-[#0062CC] text-[10px] font-bold hover:underline">Mot de passe oublié ?</Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-sm font-bold bg-[#0062CC] hover:bg-[#0052ad] text-white rounded-xl shadow-lg shadow-[#0062CC]/20 transition-all active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : "Se connecter"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 bg-white px-4">Ou</div>
              </div>

              {/* Secondary Options */}
              <div className="space-y-8">
                <Button 
                  variant="outline" 
                  className="w-full h-14 border-slate-100 bg-slate-50 hover:bg-slate-100 text-[#334155] font-bold rounded-xl gap-3"
                >
                  <QrCode className="w-5 h-5 text-[#334155]" /> Scanner QR Code
                </Button>

                <p className="text-slate-400 text-xs font-medium italic">
                    Ensemble, construisons l'avenir 💚
                </p>
              </div>

              {/* Quick Access Links */}
              <div className="pt-6 border-t border-slate-50 grid grid-cols-3 gap-2">
                <Link href="/activate/student" className="text-[9px] font-bold text-slate-400 hover:text-[#0062CC] transition-colors uppercase">Élève</Link>
                <Link href="/setup/teacher" className="text-[9px] font-bold text-slate-400 hover:text-[#0062CC] transition-colors uppercase">Enseignant</Link>
                <Link href="/setup/director" className="text-[9px] font-bold text-slate-400 hover:text-[#0062CC] transition-colors uppercase">Direction</Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
