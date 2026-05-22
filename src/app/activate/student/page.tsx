
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
        src={registrationImage?.imageUrl || "https://picsum.photos/seed/acadex-study-group/1400/1000"}
        alt="Élèves travaillant ensemble"
        fill
        priority
        className="object-cover opacity-80 saturate-[1.6]"
        data-ai-hint="students studying"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-[#F0F7FF]/50" />

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        <Link href="/login" className="mb-6 inline-flex items-center text-[#14532D] hover:text-black transition-colors gap-2 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour au portail
        </Link>

        <Card className="bg-white/95 border-none shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 bg-[#14532D] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl rotate-3">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-headline font-black text-[#1E293B] mb-2 tracking-tighter">Activation Élève</CardTitle>
            <CardDescription className="text-slate-500 font-bold">Portail d'activation ACADEX</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12">
            {step === 1 ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identifiant Personnel</Label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-[#14532D] transition-colors" />
                    <Input 
                      placeholder="Ex: ELV-3EME-001" 
                      className="bg-slate-50 border-4 border-slate-100 pl-16 h-18 text-xl font-mono font-black uppercase tracking-widest focus-visible:ring-[#14532D]/10 rounded-2xl text-[#0F172A]"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <Button className="w-full h-18 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-black text-xl rounded-2xl shadow-xl transition-all active:scale-95 border-4 border-white/10" onClick={verifyId} disabled={isLoading}>
                  {isLoading ? "Vérification..." : "Vérifier mon ID"}
                </Button>
                <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                  Utilisez le code fourni par votre établissement.
                </p>
              </div>
            ) : (
              <form onSubmit={activateAccount} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 rounded-3xl bg-[#F0F7FF] border-4 border-white flex items-center gap-6 shadow-inner">
                  <div className="w-14 h-14 rounded-2xl bg-[#14532D] flex items-center justify-center shadow-xl">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Code Validé</p>
                    <p className="text-2xl font-mono font-black text-[#14532D] tracking-tighter">{studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prénom</Label>
                    <Input 
                      className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-black text-[#0F172A]" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom</Label>
                    <Input 
                      className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-black text-[#0F172A]" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nouveau mot de passe</Label>
                  <Input 
                    type="password" 
                    className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl font-black text-[#0F172A]"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-6 pt-6 border-t-4 border-slate-50">
                  <div className="flex items-center gap-2 text-[#14532D] font-black text-[10px] uppercase tracking-[0.3em]">
                    <Sparkles className="w-4 h-4 text-accent" /> Sécurité du compte
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase ml-1">Question de secours</Label>
                    <Input 
                      placeholder="Ex: Nom de votre premier professeur ?" 
                      className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl text-sm font-bold text-[#0F172A]"
                      value={formData.secretQuestion}
                      onChange={(e) => setFormData({...formData, secretQuestion: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase ml-1">Réponse secrète</Label>
                    <Input 
                      className="bg-slate-50 border-2 border-slate-100 h-14 rounded-xl text-sm font-bold text-[#0F172A]"
                      value={formData.secretAnswer}
                      onChange={(e) => setFormData({...formData, secretAnswer: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-18 bg-[#14532D] hover:bg-[#1a6b3a] text-white font-black text-xl rounded-2xl shadow-xl transition-all active:scale-95 border-4 border-white/10" disabled={isLoading}>
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
