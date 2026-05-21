"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Save, Building, Mail, Phone, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function DirectorSetupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    schoolName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsLoading(true);
    const directorId = "DIR-001";
    
    try {
      const userRef = doc(db, "users", directorId);
      await setDoc(userRef, {
        id: directorId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `Directeur ${formData.lastName}`,
        schoolName: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "DIRECTOR",
        status: "Actif",
        createdAt: serverTimestamp()
      });

      toast({
        title: "Espace Directeur créé",
        description: `Votre identifiant de connexion est : ${directorId}`,
      });
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de créer le compte." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/login" className="mb-8 flex items-center text-accent hover:underline gap-2">
        <ArrowLeft className="w-4 h-4" /> Retour à la connexion
      </Link>

      <Card className="w-full max-w-2xl glass-card border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Créer mon espace Directeur</CardTitle>
          <CardDescription>Configuration unique de l'administrateur de l'établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="bg-white/5 border-white/10 pl-10" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input 
                  className="bg-white/5 border-white/10" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nom de l'établissement</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="bg-white/5 border-white/10 pl-10" 
                  placeholder="Ex: Complexe Scolaire ACADEX"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email"
                    className="bg-white/5 border-white/10 pl-10" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="bg-white/5 border-white/10 pl-10" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password"
                    className="bg-white/5 border-white/10 pl-10" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirmation</Label>
                <Input 
                  type="password"
                  className="bg-white/5 border-white/10" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required 
                />
              </div>
            </div>

            <Button className="w-full h-12 bg-primary text-white font-bold text-lg" disabled={isLoading}>
              <Save className="w-5 h-5 mr-2" /> Valider et Générer mon ID (DIR-001)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}