"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, CheckCircle2, User, Lock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function StudentActivationPage() {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    secretQuestion: "",
    secretAnswer: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const verifyId = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      // On vérifie d'abord si l'identifiant existe dans la collection students (pré-provisionnés)
      const studentDoc = await getDoc(doc(db, "students", studentId));
      if (studentDoc.exists()) {
        setStudentInfo(studentDoc.data());
        setFormData({...formData, firstName: studentDoc.data().firstName, lastName: studentDoc.data().lastName});
        setStep(2);
      } else {
        toast({ variant: "destructive", title: "ID Invalide", description: "Cet identifiant n'existe pas ou n'a pas été pré-créé par le directeur." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la vérification." });
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", studentId);
      await setDoc(userRef, {
        id: studentId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        role: "STUDENT_PARENT",
        password: formData.password,
        secretQuestion: formData.secretQuestion,
        secretAnswer: formData.secretAnswer,
        status: "Actif",
        activatedAt: serverTimestamp()
      });

      toast({
        title: "Compte activé !",
        description: "Vous pouvez maintenant vous connecter avec votre identifiant.",
      });
      router.push("/login");
    } catch (err) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'activer le compte." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/login" className="mb-8 flex items-center text-accent hover:underline gap-2">
        <ArrowLeft className="w-4 h-4" /> Retour à la connexion
      </Link>

      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-black" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Activation Élève</CardTitle>
          <CardDescription>Accédez à votre espace réussite ACADEX</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Saisissez votre identifiant direction</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Ex: ELV-3D-001" 
                    className="bg-white/5 border-white/10 pl-10 h-12 text-lg font-mono uppercase"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                  />
                </div>
                <p className="text-[10px] text-white/40 italic">L'identifiant est fourni par le secrétariat de l'école.</p>
              </div>
              <Button className="w-full h-12 bg-accent text-black font-bold" onClick={verifyId} disabled={isLoading}>
                {isLoading ? "Vérification..." : "Vérifier mon identifiant"}
              </Button>
            </div>
          ) : (
            <form onSubmit={activateAccount} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <p className="text-sm font-bold text-white">ID {studentId} Validé</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Prénom</Label>
                  <Input className="bg-white/5 border-white/10" value={formData.firstName} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nom</Label>
                  <Input className="bg-white/5 border-white/10" value={formData.lastName} readOnly />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Nouveau mot de passe</Label>
                <Input 
                  type="password" 
                  className="bg-white/5 border-white/10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Confirmation</Label>
                <Input 
                  type="password" 
                  className="bg-white/5 border-white/10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-1 pt-4 border-t border-white/5">
                <Label className="text-xs flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Question Secrète
                </Label>
                <Input 
                  placeholder="Ex: Le nom de mon premier animal ?" 
                  className="bg-white/5 border-white/10 text-xs"
                  value={formData.secretQuestion}
                  onChange={(e) => setFormData({...formData, secretQuestion: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Réponse</Label>
                <Input 
                  className="bg-white/5 border-white/10 text-xs"
                  value={formData.secretAnswer}
                  onChange={(e) => setFormData({...formData, secretAnswer: e.target.value})}
                  required 
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-primary text-white font-bold mt-6" disabled={isLoading}>
                {isLoading ? "Activation..." : "Activer mon espace"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}