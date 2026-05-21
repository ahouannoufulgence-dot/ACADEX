
"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, ShieldCheck, Lock, Eye, Clock, UserX, UserCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Charger les logs récents
  const auditQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(10));
  }, [db]);

  const { data: logs, loading: loadingLogs } = useCollection(auditQuery);

  // Charger tous les utilisateurs pour gestion
  const usersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: loadingUsers } = useCollection(usersQuery);

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    if (!db) return;
    setIsUpdating(userId);
    const newStatus = currentStatus === "Suspendu" ? "Actif" : "Suspendu";
    
    updateDoc(doc(db, "users", userId), { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    }).then(() => {
      toast({
        title: newStatus === "Suspendu" ? "Compte suspendu" : "Compte activé",
        description: `L'utilisateur ${userId} est désormais ${newStatus.toLowerCase()}.`
      });
    }).finally(() => setIsUpdating(null));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Sécurité & Contrôle</h1>
            <p className="text-muted-foreground">Gestion des accès, journal d'audit et surveillance des comptes.</p>
          </div>
          <Badge className="bg-accent/20 text-accent border-accent/20 h-8 px-4 font-bold flex gap-2">
            <ShieldCheck className="w-4 h-4" /> Système Protégé
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                Journal d'Audit Récent
              </CardTitle>
              <CardDescription>Historique des connexions et actions critiques.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLogs ? (
                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5">
                        <TableHead className="text-white text-xs">Utilisateur</TableHead>
                        <TableHead className="text-white text-xs">Action</TableHead>
                        <TableHead className="text-white text-xs">Heure</TableHead>
                        <TableHead className="text-right text-white text-xs">Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs?.map((log: any) => (
                        <TableRow key={log.id} className="hover:bg-white/5 border-white/5">
                          <TableCell className="font-bold text-white text-xs">{log.userName || log.userId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px]",
                              log.action.includes("Échec") ? "border-destructive text-destructive bg-destructive/10" : "border-accent text-accent bg-accent/10"
                            )}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-[10px]">
                            {log.timestamp?.toDate().toLocaleString('fr-FR')}
                          </TableCell>
                          <TableCell className="text-right text-[10px] text-muted-foreground italic">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Paramètres Globaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Verrouillage Inactivité</p>
                  <p className="text-[10px] text-muted-foreground">Déconnexion après 15 min.</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Double Authentification</p>
                  <p className="text-[10px] text-muted-foreground">Bientôt disponible.</p>
                </div>
                <Switch disabled />
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent shrink-0" />
                <p className="text-[10px] text-white/60">
                  La sécurité ACADEX utilise un chiffrement de bout en bout pour les communications et une isolation stricte des rôles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Gestion des Comptes Actifs</CardTitle>
            <CardDescription>Suspendez ou activez les accès des utilisateurs enregistrés.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-white">Utilisateur</TableHead>
                      <TableHead className="text-white">Rôle</TableHead>
                      <TableHead className="text-white">Dernière Connexion</TableHead>
                      <TableHead className="text-white">Statut</TableHead>
                      <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((u: any) => (
                      <TableRow key={u.id} className="hover:bg-white/5 border-white/5">
                        <TableCell>
                          <p className="font-bold text-white text-sm">{u.name || `${u.firstName} ${u.lastName}`}</p>
                          <p className="text-[10px] font-mono text-accent">{u.id}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] h-5 bg-white/5 text-white border-white/10">
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs italic">
                          {u.lastLogin ? u.lastLogin.toDate().toLocaleString('fr-FR') : "Jamais connecté"}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-bold",
                            u.status === "Suspendu" ? "bg-destructive/20 text-destructive border-destructive/20" : "bg-accent/20 text-accent border-accent/20"
                          )} variant="outline">
                            {u.status || "Actif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "h-8 px-3 font-bold text-[10px] uppercase transition-colors",
                              u.status === "Suspendu" ? "text-accent hover:bg-accent/10" : "text-destructive hover:bg-destructive/10"
                            )}
                            onClick={() => toggleUserStatus(u.id, u.status)}
                            disabled={isUpdating === u.id || u.role === "DIRECTOR"}
                          >
                            {isUpdating === u.id ? "..." : u.status === "Suspendu" ? <><UserCheck className="w-3 h-3 mr-1" /> Activer</> : <><UserX className="w-3 h-3 mr-1" /> Suspendre</>}
                          </Button>
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
