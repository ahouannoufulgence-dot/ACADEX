
"use client";

import React, { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserPlus, Search, Mail, Phone, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export default function TeachersPage() {
  const db = useFirestore();

  const teachersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), where("role", "==", "TEACHER"));
  }, [db]);

  const { data: teachers, loading } = useCollection(teachersQuery);

  // Tri alphabétique des enseignants
  const sortedTeachers = useMemo(() => {
    if (!teachers) return [];
    return [...teachers].sort((a: any, b: any) => {
      const nameA = `${a.lastName || a.name || ""} ${a.firstName || ""}`.toLowerCase().trim();
      const nameB = `${b.lastName || b.name || ""} ${b.firstName || ""}`.toLowerCase().trim();
      return nameA.localeCompare(nameB);
    });
  }, [teachers]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white mb-2">Corps Enseignant</h1>
            <p className="text-muted-foreground">Gestion des professeurs et de leurs affectations.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
            <UserPlus className="w-4 h-4 mr-2" /> Nouvel Enseignant
          </Button>
        </div>

        <Card className="glass-card border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom..." className="pl-10 bg-white/5 border-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12 text-muted-foreground">Chargement...</div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead className="text-white">Enseignant</TableHead>
                      <TableHead className="text-white">Matière</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Statut</TableHead>
                      <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeachers.length > 0 ? (
                      sortedTeachers.map((t: any) => (
                        <TableRow key={t.id} className="hover:bg-white/5 border-white/5">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                {(t.lastName?.[0] || t.name?.[0] || "?").toUpperCase()}
                                {(t.firstName?.[0] || "").toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {t.lastName ? t.lastName.toUpperCase() : t.name} {t.firstName || ""}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono">{t.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80">{t.subject || "-"}</TableCell>
                          <TableCell className="text-white/60 text-xs">{t.email || "Non renseigné"}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-[10px] font-bold",
                              t.status === "Inactif" ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                            )} variant="outline">
                              {t.status || "Actif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun enseignant trouvé.
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
