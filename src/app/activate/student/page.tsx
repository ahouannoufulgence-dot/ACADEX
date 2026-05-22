
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, CheckCircle2, User } from "lucide-react";
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
          setIsLoading(false);
          return;
        }
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
      status: "Actif",
      activatedAt: serverTimestamp()
    };

    // Spontané : on ne bloque pas avec await
    setDoc(userRef, userData)
      .catch(async () => {
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
      title: "Activation en cours...",
      description: "Vous allez être redirigé vers la page de connexion.",
    });
    
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#F0F7FF]">
      <Image
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-joy-study/1400/1000"}
        alt="Élèves travaillant ensemble"
        fill
        priority
        className="object-cover opacity-90 saturate-[1.8]"
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#0F172A] hover:text-primary transition-colors gap-2 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour au portail
        </Link>

        <Card className="bg-white/95 border-none shadow-2xl rounded-[2rem] overflow-hidden backdrop-blur-xl">
          <CardHeader className="text-center pb-6 pt-10">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-[#14532D] rounded-xl flex items-center justify-center mb-4 shadow-xl rotate-3">
              <GraduationCap className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter">Activation Élève</CardTitle>
            <CardDescription className="text-[#0F172A] font-black uppercase tracking-widest text-[8px] opacity-60">Portail d'activation ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-10 pb-10">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Identifiant Personnel</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A]" />
                    <Input 
                      placeholder="Ex: ELV-3EME-001" 
                      className="bg-slate-50 border-2 border-slate-100 pl-12 h-12 text-base font-mono font-black uppercase tracking-widest focus-visible:ring-primary/10 rounded-xl text-[#0F172A]"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <Button className="w-full h-12 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-black text-sm rounded-xl shadow-lg transition-all border-2 border-white/10" onClick={verifyId} disabled={isLoading}>
                  {isLoading ? "Vérification..." : "Vérifier mon ID"}
                </Button>
              </div>
            ) : (
              <form onSubmit={activateAccount} className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#F0F7FF] border-2 border-white flex items-center gap-4 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Code Validé</p>
                    <p className="text-base font-mono font-black text-[#14532D] tracking-tighter">{studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Prénom</Label>
                    <Input 
                      className="bg-slate-50 border-2 border-slate-100 h-11 rounded-xl font-black text-[#0F172A] text-xs" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Nom</Label>
                    <Input 
                      className="bg-slate-50 border-2 border-slate-100 h-11 rounded-xl font-black text-[#0F172A] text-xs" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Nouveau Mot de passe</Label>
                  <Input 
                    type="password" 
                    className="bg-slate-50 border-2 border-slate-100 h-11 rounded-xl font-black text-[#0F172A] text-xs"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-12 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-black text-sm rounded-xl shadow-lg transition-all border-2 border-white/10" disabled={isLoading}>
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
