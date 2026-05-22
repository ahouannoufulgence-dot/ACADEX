"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, CheckCircle2, User, Lock, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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

  const registrationImage = PlaceHolderImages.find(img => img.id === "login-bg");

  const verifyId = async () => {
    if (!db || !studentId) return;
    setIsLoading(true);
    try {
      const studentDoc = await getDoc(doc(db, "students", studentId));
      
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        if (data.status === "Actif") {
          toast({ variant: "destructive", title: "Déjà activé", description: "Ce compte est déjà actif. Connectez-vous directement." });
          return;
        }
        setStudentInfo(data);
        setStep(2);
      } else {
        toast({ 
          variant: "destructive", 
          title: "ID Invalide", 
          description: "Cet identifiant n'existe pas. Demandez-le à votre direction." 
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Erreur", description: "Vérification impossible." });
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !studentId) return;

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsLoading(true);
    const userRef = doc(db, "users", studentId);
    const studentRef = doc(db, "students", studentId);
    
    const userData = {
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
    };

    setDoc(userRef, userData)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    updateDoc(studentRef, {
      status: "Actif",
      firstName: formData.firstName,
      lastName: formData.lastName,
      activatedAt: serverTimestamp()
    }).catch(async () => {
       const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'update',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    toast({
      title: "Compte activé !",
      description: "Vous pouvez maintenant vous connecter.",
    });
    
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-[#F0F7FF]">
      {/* Immersive Background */}
      <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-success/1400/1000"}
        alt="Élèves souriants"
        fill
        priority
        className="object-cover opacity-30"
        data-ai-hint="happy African students school"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-[#F0F7FF]/50" />

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#14532D] hover:text-black transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour au portail
        </Link>

        <Card className="bg-white/95 border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 bg-[#14532D] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl rotate-3">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-headline font-bold text-[#1E293B] mb-2">Activation Élève</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Portail d'activation ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12">
            {step === 1 ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Identifiant Personnel</Label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-[#14532D] transition-colors" />
                    <Input 
                      placeholder="Ex: ELV-3EME-001" 
                      className="bg-slate-50 border-slate-100 pl-16 h-18 text-xl font-mono uppercase tracking-widest focus-visible:ring-[#14532D]/10 rounded-2xl"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <Button className="w-full h-18 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-bold text-xl rounded-2xl shadow-xl transition-all active:scale-95" onClick={verifyId} disabled={isLoading}>
                  {isLoading ? "Vérification..." : "Vérifier mon ID"}
                </Button>
                <p className="text-center text-xs text-slate-400 font-medium italic">
                  Utilisez le code fourni par votre établissement.
                </p>
              </div>
            ) : (
              <form onSubmit={activateAccount} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#14532D] flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code Validé avec succès</p>
                    <p className="text-lg font-mono font-bold text-[#14532D]">{studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prénom</Label>
                    <Input 
                      className="bg-slate-50 border-slate-100 h-14 rounded-xl font-medium" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nom</Label>
                    <Input 
                      className="bg-slate-50 border-slate-100 h-14 rounded-xl font-medium" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Choisir un mot de passe</Label>
                  <Input 
                    type="password" 
                    className="bg-slate-50 border-slate-100 h-14 rounded-xl"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[#14532D] font-bold text-[10px] uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> Sécurité du compte
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Question de secours</Label>
                    <Input 
                      placeholder="Ex: Quel est votre plat préféré ?" 
                      className="bg-slate-50 border-slate-100 h-14 rounded-xl text-sm"
                      value={formData.secretQuestion}
                      onChange={(e) => setFormData({...formData, secretQuestion: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Réponse secrète</Label>
                    <Input 
                      className="bg-slate-50 border-slate-100 h-14 rounded-xl text-sm"
                      value={formData.secretAnswer}
                      onChange={(e) => setFormData({...formData, secretAnswer: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-18 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-bold text-xl rounded-2xl shadow-xl transition-all active:scale-95" disabled={isLoading}>
                  {isLoading ? "Finalisation..." : "Activer mon espace ACADEX"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
