"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, GraduationCap, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
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
          src={bgImage?.imageUrl || "https://picsum.photos/seed/acadex/1920/1080"}
          alt="School ambiance"
          fill
          priority
          className="object-cover opacity-10"
          data-ai-hint="African students classroom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F7F9]/90 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row items-center gap-12 px-6">
        <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-300">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#1A6B4A] rounded-2xl flex items-center justify-center shadow-xl shadow-[#1A6B4A]/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-headline font-bold text-[#1F2937] tracking-tighter leading-none">ACADEX</h1>
            <p className="text-xl text-slate-500 font-medium max-w-sm">
              La gestion scolaire moderne, sécurisée et premium.
            </p>
          </div>

          <Alert className="bg-[#1A6B4A]/5 border-[#1A6B4A]/10 text-[#1A6B4A] max-w-sm">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs font-bold">
              Utilisez DIR-001 / Admin2026 pour tester l'espace Directeur.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-3 sm:max-w-sm">
            <Link href="/setup/director">
              <Button variant="outline" className="w-full justify-start h-14 bg-white border-slate-200 hover:border-[#1A6B4A] hover:bg-slate-50 text-[#1F2937]">
                <KeyRound className="w-5 h-5 mr-3 text-[#1A6B4A]" />
                <span className="font-bold">Espace Directeur</span>
              </Button>
            </Link>

            <Link href="/setup/teacher">
              <Button variant="outline" className="w-full justify-start h-14 bg-white border-slate-200 hover:border-[#1A6B4A] hover:bg-slate-50 text-[#1F2937]">
                <Users className="w-5 h-5 mr-3 text-[#1A6B4A]" />
                <span className="font-bold">Espace Enseignant</span>
              </Button>
            </Link>

            <Link href="/activate/student">
              <Button variant="outline" className="w-full justify-start h-14 bg-white border-slate-200 hover:border-[#1A6B4A] hover:bg-slate-50 text-[#1F2937]">
                <GraduationCap className="w-5 h-5 mr-3 text-[#1A6B4A]" />
                <span className="font-bold">Espace Élève / Parent</span>
              </Button>
            </Link>
          </div>
        </div>

        <Card className="w-full max-w-md premium-card animate-in slide-in-from-right duration-300">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-headline font-bold text-[#1F2937]">Connexion</CardTitle>
            <CardDescription className="font-medium">Identifiants sécurisés ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Identifiant Unique</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="userId"
                    placeholder="DIR-001, ENS-..., ELV-..."
                    className="pl-10 bg-[#F5F7F9] border-none text-[#1F2937] font-bold h-12"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Mot de passe</Label>
                  <button type="button" className="text-[10px] text-[#1A6B4A] font-bold hover:underline">Oublié ?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 bg-[#F5F7F9] border-none text-[#1F2937] h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-[#1F2937]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-[#1A6B4A]" />
                <Label htmlFor="remember" className="text-xs text-slate-500 font-medium">Rester connecté</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-[#1A6B4A] hover:bg-[#1A6B4A]/90 text-white shadow-lg shadow-[#1A6B4A]/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Se connecter"}
              </Button>
            </form>

            <div className="pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                Premium Education Systems
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
