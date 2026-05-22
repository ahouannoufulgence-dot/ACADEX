"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, ShieldCheck, Lock, UserX, UserCheck, AlertCircle } from "lucide-react";
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
        description: `L'utilisateur ${userId} est désormais ${newStatus.toLowerCase()}.`,
        variant: newStatus === "Suspendu" ? "destructive" : "default"
      });
    }).finally(() => setIsUpdating(null));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Sécurité & Contrôle</h1>
            <p className="text-slate-500 font-medium">Gestion des accès, journal d'audit et surveillance.</p>
          </div>
          <Badge className="bg-[#14532D]/20 text-[#14532D] border-[#14532D]/30 h-10 px-6 font-bold flex gap-2 rounded-xl">
            <ShieldCheck className="w-5 h-5" /> Système Protégé
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                <Lock className="w-6 h-6 text-[#14532D]" />
                Journal d'Audit Récent
              </CardTitle>
              <CardDescription className="text-slate-500">Historique des connexions et actions critiques.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {loadingLogs ? (
                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-[#14532D] border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5">
                        <TableHead className="text-slate-400 font-bold">Utilisateur</TableHead>
                        <TableHead className="text-slate-400 font-bold">Action</TableHead>
                        <TableHead className="text-slate-400 font-bold">Heure</TableHead>
                        <TableHead className="text-right text-slate-400 font-bold">Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs?.map((log: any) => (
                        <TableRow key={log.id} className="hover:bg-white/5 transition-colors border-white/5">
                          <TableCell className="font-bold text-white text-sm">{log.userName || log.userId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold h-6 uppercase px-2",
                              log.action.includes("Échec") || log.action.includes("suspendu") 
                                ? "border-[#B91C1C]/40 text-[#B91C1C] bg-[#B91C1C]/10" 
                                : "border-[#14532D]/40 text-[#14532D] bg-[#14532D]/10"
                            )}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs font-medium">
                            {log.timestamp?.toDate().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500 italic">
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

          <Card className="premium-card bg-[#B91C1C]/10 border-[#B91C1C]/20">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-[#B91C1C]">
                <ShieldAlert className="w-6 h-6 text-[#B91C1C]" />
                Alertes de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Verrouillage Inactivité</p>
                  <Switch defaultChecked disabled className="data-[state=checked]:bg-[#14532D]" />
                </div>
                <p className="text-xs text-slate-500">Déconnexion automatique après 15 min d'inactivité.</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-[#B91C1C]/20 border border-[#B91C1C]/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-[#B91C1C] shrink-0" />
                <p className="text-xs text-[#B91C1C] leading-relaxed font-bold">
                  Toute suspension de compte enseignant ou administratif doit être justifiée par une note de service archivée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-bold text-white">Gestion des Comptes Actifs</CardTitle>
            <CardDescription className="text-slate-500">Modifiez l'état des accès institutionnels en temps réel.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {loadingUsers ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-[#14532D] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="rounded-2xl border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-slate-400 font-bold">Utilisateur</TableHead>
                      <TableHead className="text-slate-400 font-bold">Rôle</TableHead>
                      <TableHead className="text-slate-400 font-bold">Dernière Connexion</TableHead>
                      <TableHead className="text-slate-400 font-bold">Statut</TableHead>
                      <TableHead className="text-right text-slate-400 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((u: any) => (
                      <TableRow key={u.id} className="hover:bg-white/5 transition-colors border-white/5">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{u.name || `${u.firstName} ${u.lastName}`}</span>
                            <span className="text-[10px] font-mono text-[#14532D] uppercase font-bold">{u.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] h-6 font-bold bg-white/10 text-slate-400 border-none uppercase tracking-wider px-3">
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs font-medium italic">
                          {u.lastLogin ? u.lastLogin.toDate().toLocaleString('fr-FR') : "Jamais connecté"}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-bold h-6 px-3 uppercase tracking-wider",
                            u.status === "Suspendu" 
                              ? "bg-[#B91C1C]/20 text-[#B91C1C] border-[#B91C1C]/30" 
                              : "bg-[#14532D]/20 text-[#14532D] border-[#14532D]/30"
                          )} variant="outline">
                            {u.status || "Actif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "h-9 px-4 font-bold text-[10px] uppercase rounded-xl transition-all active:scale-95",
                              u.status === "Suspendu" 
                                ? "text-[#14532D] hover:bg-[#14532D]/10" 
                                : "text-[#B91C1C] hover:bg-[#B91C1C]/10"
                            )}
                            onClick={() => toggleUserStatus(u.id, u.status)}
                            disabled={isUpdating === u.id || u.role === "DIRECTOR"}
                          >
                            {isUpdating === u.id ? "..." : u.status === "Suspendu" ? <><UserCheck className="w-3 h-3 mr-2" /> Activer</> : <><UserX className="w-3 h-3 mr-2" /> Suspendre</>}
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
