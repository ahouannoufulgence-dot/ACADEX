
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, GraduationCap, Users, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F7F9]">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-bg/1920/1080"}
          alt="School ambiance"
          fill
          priority
          className="object-cover opacity-[0.08] transition-opacity duration-1000"
          data-ai-hint="happy African students"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F7F9]/95 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center gap-16 px-6">
        <div className="flex-1 space-y-10 animate-in slide-in-from-left duration-500">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-[#1A6B4A] rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(26,107,74,0.3)] transition-transform hover:scale-105">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-7xl font-headline font-bold text-[#1F2937] tracking-tighter leading-none mb-4">ACADEX</h1>
              <p className="text-2xl text-slate-500 font-medium max-w-md leading-relaxed">
                L'excellence éducative au service de la <span className="text-[#1A6B4A] font-bold">prochaine génération</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <Link href="/setup/director">
              <Button variant="outline" className="w-full justify-start h-16 bg-white border-slate-100 shadow-sm hover:border-[#1A6B4A] hover:bg-slate-50 text-[#1F2937] group">
                <div className="w-10 h-10 rounded-lg bg-[#1A6B4A]/10 flex items-center justify-center mr-3 group-hover:bg-[#1A6B4A] transition-colors">
                  <KeyRound className="w-5 h-5 text-[#1A6B4A] group-hover:text-white" />
                </div>
                <span className="font-bold">Espace Directeur</span>
              </Button>
            </Link>

            <Link href="/setup/teacher">
              <Button variant="outline" className="w-full justify-start h-16 bg-white border-slate-100 shadow-sm hover:border-[#1A6B4A] hover:bg-slate-50 text-[#1F2937] group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 group-hover:bg-blue-500 transition-colors">
                  <Users className="w-5 h-5 text-blue-500 group-hover:text-white" />
                </div>
                <span className="font-bold">Espace Enseignant</span>
              </Button>
            </Link>

            <Link href="/activate/student" className="sm:col-span-2">
              <Button variant="outline" className="w-full justify-start h-16 bg-[#1A6B4A]/5 border-[#1A6B4A]/20 hover:bg-[#1A6B4A]/10 text-[#1A6B4A] group">
                <div className="w-10 h-10 rounded-lg bg-[#1A6B4A] flex items-center justify-center mr-3 shadow-lg shadow-[#1A6B4A]/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold block leading-none mb-1">Activation Élève / Parent</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Utilisez l'identifiant de la direction</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <Card className="w-full max-w-md premium-card border border-white/20 shadow-2xl animate-in slide-in-from-right duration-500">
          <CardHeader className="text-center pt-10 pb-8">
            <CardTitle className="text-3xl font-headline font-bold text-[#1F2937]">Connexion</CardTitle>
            <CardDescription className="font-medium text-slate-400">Identifiants sécurisés ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="userId" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-1">Identifiant Unique</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A6B4A] transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="userId"
                    placeholder="DIR-001, ENS-..., ELV-..."
                    className="pl-12 bg-[#F5F7F9] border-none text-[#1F2937] font-bold h-14 rounded-xl focus-visible:ring-2 focus-visible:ring-[#1A6B4A]/20"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Mot de passe</Label>
                  <button type="button" className="text-[10px] text-[#1A6B4A] font-bold hover:underline">Mot de passe oublié ?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A6B4A] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-12 pr-12 bg-[#F5F7F9] border-none text-[#1F2937] font-bold h-14 rounded-xl focus-visible:ring-2 focus-visible:ring-[#1A6B4A]/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F2937] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-1">
                <Checkbox id="remember" className="w-5 h-5 border-slate-300 data-[state=checked]:bg-[#1A6B4A] rounded-md" />
                <Label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Rester connecté</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-[#1A6B4A] hover:bg-[#124d35] text-white shadow-[0_15px_30px_-5px_rgba(26,107,74,0.3)] transition-all active:scale-[0.98] rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Accéder à l'espace"}
              </Button>
            </form>

            <div className="pt-6 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                <Sparkles className="w-3 h-3 text-[#1A6B4A]" />
                Premium School Management
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
