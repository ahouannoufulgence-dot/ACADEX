
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, GraduationCap, Users } from "lucide-react";
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
import { FirestorePermissionError } from "@/firebase/errors";

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
      // Pour les tests du directeur DIR-001
      if (userId === "DIR-001" && password === "Admin2026") {
        const userData = { 
          id: userId, 
          name: "Directeur Acadex",
          role: "DIRECTOR"
        };
        localStorage.setItem("acadex_user", JSON.stringify(userData));
        
        // Log de sécurité
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

      // Recherche de l'utilisateur par son identifiant personnalisé
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
          
          // Mise à jour de la dernière connexion
          updateDoc(doc(db, "users", userId), { lastLogin: serverTimestamp() }).catch(() => {});

          // Log de sécurité
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
          // Log échec
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage?.imageUrl || "https://picsum.photos/seed/acadex/1920/1080"}
          alt="School ambiance"
          fill
          priority
          className="object-cover scale-105 animate-pulse-slow opacity-40"
          data-ai-hint="African students classroom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row gap-8 px-4">
        <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-300">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-headline font-bold text-white tracking-tight">ACADEX</h1>
            <p className="text-xl text-accent font-medium max-w-md">
              La gestion scolaire moderne, sécurisée et intelligente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:max-w-md">
            <Link href="/setup/director">
              <Button variant="outline" className="w-full justify-start h-14 bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary text-white">
                <KeyRound className="w-5 h-5 mr-3 text-accent" />
                <div className="text-left">
                  <p className="text-sm font-bold">Créer mon espace Directeur</p>
                  <p className="text-[10px] text-white/50">Configuration initiale de l'établissement</p>
                </div>
              </Button>
            </Link>

            <Link href="/setup/teacher">
              <Button variant="outline" className="w-full justify-start h-14 bg-white/5 border-white/10 hover:bg-blue-500/20 hover:border-blue-500 text-white">
                <Users className="w-5 h-5 mr-3 text-blue-400" />
                <div className="text-left">
                  <p className="text-sm font-bold">Créer mon espace Enseignant</p>
                  <p className="text-[10px] text-white/50">Activation de compte professeur</p>
                </div>
              </Button>
            </Link>

            <Link href="/activate/student">
              <Button variant="outline" className="w-full justify-start h-14 bg-white/5 border-white/10 hover:bg-accent/20 hover:border-accent text-white">
                <GraduationCap className="w-5 h-5 mr-3 text-accent" />
                <div className="text-left">
                  <p className="text-sm font-bold">Activer mon espace élève</p>
                  <p className="text-[10px] text-white/50">Pour élèves et parents (via ID direction)</p>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <Card className="w-full max-w-md glass-card border-white/10 animate-in slide-in-from-right duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline font-bold text-white">Connexion</CardTitle>
            <CardDescription className="text-white/60 italic">Saisissez vos accès ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">Identifiant Unique</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userId"
                    placeholder="Ex: DIR-001, ENS-MATH-001..."
                    className="pl-10 bg-white/5 border-white/10 text-white h-11"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <button type="button" className="text-[10px] text-accent hover:underline">Mot de passe oublié ?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-white/20" />
                <Label htmlFor="remember" className="text-xs text-white/60">Rester connecté</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-white/40 text-[10px] italic">
                Système sécurisé ACADEX v2.5 - Bénin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
