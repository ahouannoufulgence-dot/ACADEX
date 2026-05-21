"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, Save, Mail, Phone, Lock, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function TeacherSetupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
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
    
    try {
      // Génération d'ID ENS-
      const subjectCode = formData.subject.substring(0, 4).toUpperCase();
      const randomId = Math.floor(Math.random() * 900) + 100;
      const teacherId = `ENS-${subjectCode}-${randomId}`;
      
      const userRef = doc(db, "users", teacherId);
      await setDoc(userRef, {
        id: teacherId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `M. ${formData.lastName}`,
        subject: formData.subject,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "TEACHER",
        status: "Actif",
        createdAt: serverTimestamp()
      });

      toast({
        title: "Espace Enseignant activé",
        description: `Votre identifiant est : ${teacherId}`,
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
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Créer mon espace Enseignant</CardTitle>
          <CardDescription>Enregistrement de nouveau professeur sur ACADEX</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input 
                  className="bg-white/5 border-white/10" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required 
                />
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
              <Label>Matière Enseignée</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="bg-white/5 border-white/10 pl-10" 
                  placeholder="Ex: Mathématiques, Physique..."
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  className="bg-white/5 border-white/10" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  className="bg-white/5 border-white/10" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input 
                  type="password"
                  className="bg-white/5 border-white/10" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
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

            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={isLoading}>
              <Save className="w-5 h-5 mr-2" /> Valider mon inscription
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}