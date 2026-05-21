
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Search, TrendingUp, Filter, ArrowUpRight, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function GradesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [newValue, setNewValue] = useState("");

  const gradesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "grades"), orderBy("date", "desc"));
  }, [db]);

  const { data: grades, loading } = useCollection(gradesQuery);

  const handleUpdate = () => {
    if (!db || !editingGrade || !newValue) return;

    const gradeRef = doc(db, "grades", editingGrade.id);
    const updatedData = {
      value: Number(newValue),
      updatedBy: "Directeur (Correction)",
      lastModified: serverTimestamp()
    };

    updateDoc(gradeRef, updatedData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: gradeRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ title: "Note mise à jour", description: "La correction a été enregistrée par la direction." });
    setEditingGrade(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Contrôle des Notes</h1>
            <p className="text-muted-foreground">Supervisez et rectifiez les évaluations publiées.</p>
          </div>
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2">
             <AlertCircle className="w-4 h-4 text-accent" />
             <span className="text-xs font-bold text-accent">Droit de rectification direction activé</span>
          </div>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher un élève..." className="pl-10 bg-white/5 border-white/10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-white">Élève</TableHead>
                      <TableHead className="text-white">Matière</TableHead>
                      <TableHead className="text-white text-center">Note / 20</TableHead>
                      <TableHead className="text-white">Statut</TableHead>
                      <TableHead className="text-white">Saisi par</TableHead>
                      <TableHead className="text-right text-white">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades?.map((g: any) => (
                      <TableRow key={g.id} className="hover:bg-white/5 border-white/5 group">
                        <TableCell className="font-bold text-white">{g.studentName}</TableCell>
                        <TableCell className="text-white/60 text-xs">
                          {g.subjectName}
                          <p className="text-[10px] text-accent uppercase font-bold">{g.type}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-accent border-accent/20 font-bold px-3 py-1">
                            {g.value}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={g.status === "Confirmé" ? "bg-accent/20 text-accent" : "bg-amber-400/20 text-amber-400"} variant="outline">
                            {g.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground italic">{g.updatedBy}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-accent hover:text-accent hover:bg-accent/10"
                                onClick={() => {
                                  setEditingGrade(g);
                                  setNewValue(g.value.toString());
                                }}
                              >
                                <Edit3 className="w-4 h-4 mr-2" /> Rectifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-white/10 text-white">
                              <DialogHeader>
                                <DialogTitle>Rectification Administrative</DialogTitle>
                                <CardDescription className="text-white/60">
                                  Modification de la note de <b>{editingGrade?.studentName}</b> en <b>{editingGrade?.subjectName}</b>.
                                </CardDescription>
                              </DialogHeader>
                              <div className="py-6">
                                <label className="text-xs font-bold text-white mb-2 block uppercase">Nouvelle Note / 20</label>
                                <Input 
                                  type="number" 
                                  step="0.25" 
                                  max="20"
                                  className="bg-white/5 border-white/10 h-12 text-2xl text-center text-accent font-bold"
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button className="bg-primary text-white font-bold w-full h-11" onClick={handleUpdate}>
                                  Confirmer la Rectification
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!grades || grades.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                          Aucune note enregistrée pour le moment.
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
