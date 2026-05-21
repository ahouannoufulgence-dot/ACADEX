"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KeyRound, ShieldCheck, Users, Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, serverTimestamp, writeBatch, deleteDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function AccessManagementPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [bulkData, setBulkData] = useState({
    gradeLevel: "",
    count: 1
  });

  const studentsQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "students");
  }, [db]);

  const { data: students, loading } = useCollection(studentsQuery);

  const handleBulkGenerate = () => {
    if (!db || !bulkData.gradeLevel || bulkData.count < 1) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir le niveau et le nombre d'élèves."
      });
      return;
    }

    setIsGenerating(true);
    const batch = writeBatch(db);
    const classCode = bulkData.gradeLevel.replace(/\s+/g, '').toUpperCase();
    
    for (let i = 1; i <= bulkData.count; i++) {
      const studentNumber = i.toString().padStart(3, '0');
      const studentId = `ELV-${classCode}-${studentNumber}`;
      const studentRef = doc(db, "students", studentId);
      
      batch.set(studentRef, {
        id: studentId,
        gradeLevel: bulkData.gradeLevel,
        status: "En attente",
        createdAt: serverTimestamp()
      });
    }

    batch.commit()
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'students/bulk',
          operation: 'write',
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({
      title: "Génération lancée",
      description: `${bulkData.count} accès créés pour ${bulkData.gradeLevel}.`
    });
    
    setIsGenerating(false);
    setBulkData({ gradeLevel: "", count: 1 });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    
    deleteDoc(doc(db, "students", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `students/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    toast({ 
      title: "Identifiant supprimé", 
      description: "Le code d'accès a été retiré de la base de données." 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: "Identifiant copié." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Gestion des Accès</h1>
            <p className="text-muted-foreground">Provisionnez les accès élèves par classe.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white font-bold h-10 px-6">
                <Users className="w-4 h-4 mr-2" /> Provisionner une classe
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Génération par Lot
                </DialogTitle>
                <CardDescription className="text-white/60">
                  Créez plusieurs identifiants d'activation pour une classe spécifique.
                </CardDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Niveau / Classe (Ex: 3EME A)</Label>
                  <Input 
                    placeholder="3EME A"
                    className="bg-white/5 border-white/10 h-11" 
                    value={bulkData.gradeLevel}
                    onChange={(e) => setBulkData({...bulkData, gradeLevel: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre d'élèves</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="100"
                    className="bg-white/5 border-white/10 h-11" 
                    value={bulkData.count}
                    onChange={(e) => setBulkData({...bulkData, count: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  className="bg-accent text-black font-bold w-full h-11" 
                  onClick={handleBulkGenerate} 
                  disabled={isGenerating}
                >
                  {isGenerating ? "Génération..." : "Générer les identifiants"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Identifiants en attente d'activation</CardTitle>
            <CardDescription>Remettez ces codes aux élèves pour qu'ils créent leur compte.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12 text-muted-foreground">
                 <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-white text-xs uppercase font-bold">Identifiant</TableHead>
                      <TableHead className="text-white text-xs uppercase font-bold">Classe</TableHead>
                      <TableHead className="text-white text-xs uppercase font-bold">Statut</TableHead>
                      <TableHead className="text-right text-white text-xs uppercase font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.filter((s: any) => s.status === "En attente").map((u: any) => (
                      <TableRow key={u.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                        <TableCell className="font-mono font-bold text-accent">{u.id}</TableCell>
                        <TableCell className="text-white/80">{u.gradeLevel}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-400/20 text-amber-400 text-[10px] border-amber-400/20" variant="outline">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-accent"
                              onClick={() => copyToClipboard(u.id)}
                              title="Copier le code"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(u.id)}
                              title="Supprimer l'accès"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {students?.filter((s: any) => s.status === "En attente").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic text-sm">
                          Aucun identifiant en attente d'activation.
                        </TableCell>
                      </TableRow>
                    )}
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
