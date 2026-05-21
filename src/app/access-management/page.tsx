"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KeyRound, UserPlus, Search, ShieldCheck, RefreshCw, Trash2, MoreVertical, Copy, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, setDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { provisionUserAccount } from "@/ai/flows/director-account-provisioning-assistant";
import { cn } from "@/lib/utils";

export default function AccessManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    userType: "ELEVE" as "ELEVE" | "ENSEIGNANT" | "PARENT",
    gradeLevel: "",
    subject: ""
  });
  
  const [aiResult, setAiResult] = useState<any>(null);

  const usersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "users");
  }, [db]);

  const { data: users, loading } = useCollection(usersQuery);

  const handleGenerate = async () => {
    if (!newUserData.firstName || !newUserData.lastName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir le nom et le prénom."
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulation d'un mot de passe temporaire aléatoire
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      
      const result = await provisionUserAccount({
        userType: newUserData.userType as any,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        gradeLevel: newUserData.gradeLevel,
        subject: newUserData.subject
      });

      setAiResult({
        ...result,
        tempPassword
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur IA",
        description: "Impossible de générer les accès."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveUser = async () => {
    if (!db || !aiResult) return;

    const userRef = doc(db, "users", aiResult.suggestedId);
    const userData = {
      id: aiResult.suggestedId,
      name: `${newUserData.firstName} ${newUserData.lastName}`,
      role: newUserData.userType === "ELEVE" || newUserData.userType === "PARENT" ? "STUDENT_PARENT" : "TEACHER",
      status: "Actif",
      mustChangePassword: true,
      tempPassword: aiResult.tempPassword,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(userRef, userData);
      toast({
        title: "Accès créés",
        description: `L'identifiant ${aiResult.suggestedId} a été enregistré.`
      });
      setAiResult(null);
      setNewUserData({ firstName: "", lastName: "", userType: "ELEVE", gradeLevel: "", subject: "" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur Firestore",
        description: "Impossible d'enregistrer l'utilisateur."
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Texte copié dans le presse-papier." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Gestion des Accès</h1>
            <p className="text-muted-foreground">Générez et gérez les identifiants de connexion sécurisés.</p>
          </div>
          
          <Dialog onOpenChange={(open) => !open && setAiResult(null)}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white font-bold">
                <UserPlus className="w-4 h-4 mr-2" /> Générer un accès
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Génération d'Identifiants
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Créez un compte utilisateur avec un mot de passe temporaire.
                </DialogDescription>
              </DialogHeader>

              {!aiResult ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input 
                        className="bg-white/5 border-white/10" 
                        value={newUserData.firstName}
                        onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input 
                        className="bg-white/5 border-white/10" 
                        value={newUserData.lastName}
                        onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type d'utilisateur</Label>
                    <Select value={newUserData.userType} onValueChange={(v: any) => setNewUserData({...newUserData, userType: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ELEVE">Élève</SelectItem>
                        <SelectItem value="ENSEIGNANT">Enseignant</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUserData.userType === "ELEVE" && (
                    <div className="space-y-2">
                      <Label>Classe / Niveau</Label>
                      <Input 
                        placeholder="Ex: 3ème A"
                        className="bg-white/5 border-white/10" 
                        value={newUserData.gradeLevel}
                        onChange={(e) => setNewUserData({...newUserData, gradeLevel: e.target.value})}
                      />
                    </div>
                  )}
                  {newUserData.userType === "ENSEIGNANT" && (
                    <div className="space-y-2">
                      <Label>Matière</Label>
                      <Input 
                        placeholder="Ex: Mathématiques"
                        className="bg-white/5 border-white/10" 
                        value={newUserData.subject}
                        onChange={(e) => setNewUserData({...newUserData, subject: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <p className="text-xs font-bold text-accent uppercase mb-1">Identifiant</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-white">{aiResult.suggestedId}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(aiResult.suggestedId)}><Copy className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-xs font-bold text-destructive uppercase mb-1">Mot de passe temporaire</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-white">{aiResult.tempPassword}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(aiResult.tempPassword)}><Copy className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold text-white/60 uppercase mb-2">Message à remettre</p>
                    <p className="text-xs text-white/80 italic leading-relaxed">{aiResult.draftWelcomeMessage}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                {!aiResult ? (
                  <Button className="bg-accent text-black font-bold w-full" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? "Génération..." : "Générer les accès"}
                  </Button>
                ) : (
                  <Button className="bg-primary text-white font-bold w-full" onClick={saveUser}>
                    Confirmer et Enregistrer
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher par identifiant ou nom..." className="pl-10 bg-white/5 border-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12 text-muted-foreground">Chargement des accès...</div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead className="text-white">Utilisateur</TableHead>
                      <TableHead className="text-white">Identifiant</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Statut</TableHead>
                      <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((u: any) => (
                      <TableRow key={u.id} className="hover:bg-white/5 border-white/5">
                        <TableCell>
                          <p className="font-bold text-white">{u.name}</p>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{u.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] border-white/10 text-white/60">
                            {u.role === "DIRECTOR" ? "Directeur" : u.role === "TEACHER" ? "Enseignant" : "Élève/Parent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-accent/20 text-accent text-[10px] font-bold" variant="outline">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}