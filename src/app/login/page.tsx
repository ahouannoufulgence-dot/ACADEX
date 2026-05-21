
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
  // Initialisation avec les identifiants provisoires demandés
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
      // Simulation d'email pour l'authentification Firebase
      const email = `${userId.toLowerCase()}@acadex.edu`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("acadex_user", JSON.stringify({ 
          id: userId, 
          name: userData.name,
          uid: userCredential.user.uid
        }));
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${userData.name}.`,
        });
        
        router.push("/dashboard");
      } else {
        // Pour la démo, si le document n'existe pas encore, on crée une session locale
        localStorage.setItem("acadex_user", JSON.stringify({ 
          id: userId, 
          name: "Administrateur Provisoire",
          uid: userCredential.user.uid
        }));
        router.push("/dashboard");
      }
    } catch (error: any) {
      // En cas d'échec de l'auth réelle (ex: compte pas encore créé), 
      // on autorise quand même l'accès pour la démonstration de l'interface
      if (userId === "DIR-001" && password === "Admin2026") {
        localStorage.setItem("acadex_user", JSON.stringify({ 
          id: userId, 
          name: "Directeur Acadex",
        }));
        toast({
          title: "Mode Démonstration",
          description: "Accès autorisé avec les identifiants provisoires.",
        });
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiants incorrects. Veuillez utiliser DIR-001 / Admin2026.",
        });
      }
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
            "Apprendre aujourd'hui, réussir demain"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-100/80 leading-tight">
              Utilisez <span className="font-bold text-white">DIR-001</span> et <span className="font-bold text-white">Admin2026</span> pour tester l'interface Directeur.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-white/80">Identifiant</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userId"
                  placeholder="Ex: DIR-001"
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

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-accent data-[state=checked]:text-black" />
                <label htmlFor="remember" className="text-white/70 cursor-pointer">Rester connecté</label>
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
              © 2024 ACADEX. Système de gestion sécurisé.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
