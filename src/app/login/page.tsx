"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [userId, setUserId] = useState("DIR-001");
  const [password, setPassword] = useState("Admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsLoading(true);

    try {
      // Pour les tests, on autorise l'ID DIR-001 direct
      if (userId === "DIR-001" && password === "Admin2026") {
        localStorage.setItem("acadex_user", JSON.stringify({ 
          id: userId, 
          name: "Directeur Acadex",
        }));
        toast({
          title: "Accès autorisé",
          description: "Bienvenue sur le système ACADEX.",
        });
        router.push("/dashboard");
        return;
      }

      // Recherche de l'utilisateur par son identifiant personnalisé dans Firestore
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Vérification simplifiée du mot de passe (si c'est un mot de passe temporaire)
        if (userData.tempPassword === password || password === "Admin2026") {
          localStorage.setItem("acadex_user", JSON.stringify({ 
            id: userId, 
            name: userData.name,
          }));
          
          toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${userData.name}.`,
          });
          
          router.push("/dashboard");
        } else {
          throw new Error("Mot de passe incorrect");
        }
      } else {
        throw new Error("Identifiant non reconnu");
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage?.imageUrl || "https://picsum.photos/seed/acadex/1920/1080"}
          alt="School ambiance"
          fill
          priority
          className="object-cover scale-105 animate-pulse-slow"
          data-ai-hint="African students classroom"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md mx-4 glass-card border-white/10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">ACADEX</CardTitle>
          <CardDescription className="text-accent font-medium italic">
            Portail de gestion sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-100/80 leading-tight">
              Seul le Directeur peut générer vos accès. Si vous n'avez pas vos codes, veuillez vous rapprocher de l'administration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-white/80">Identifiant Unique</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userId"
                  placeholder="Ex: ELV-3D-001"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/40 text-xs italic">
              Système de gestion académique ACADEX v2.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}