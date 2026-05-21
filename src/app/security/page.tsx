"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, ShieldCheck, Lock, Eye, Clock, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-2">Sécurité & Contrôle</h1>
          <p className="text-muted-foreground">Gestion des accès et surveillance du système.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                Paramètres d'accès
              </CardTitle>
              <CardDescription>Configurez les politiques d'authentification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Double Authentification (2FA)</p>
                  <p className="text-xs text-muted-foreground">Ajouter une couche de sécurité par SMS.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Verrouillage de session automatique</p>
                  <p className="text-xs text-muted-foreground">Déconnexion après 15 minutes d'inactivité.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Restriction IP</p>
                  <p className="text-xs text-muted-foreground">Autoriser uniquement les IPs de l'école.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Logs récents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="mt-1"><ShieldCheck className="w-3 h-3 text-accent" /></div>
                  <div>
                    <p className="text-white font-bold">Connexion réussie</p>
                    <p className="text-muted-foreground">Utilisateur: ENS-MATH-001</p>
                    <p className="text-[10px] text-muted-foreground/60">Il y a 5 min • IP: 197.234.xx.xx</p>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full text-xs text-accent">Voir tout le journal</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}