
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Clock, 
  MapPin,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { getRoleFromId } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    day: "Lun",
    startTime: "07h00",
    endTime: "08h00",
    subject: "",
    room: "",
    teacher: ""
  });

  const hours = ["07h00", "08h00", "09h00", "10h00", "11h00", "12h00", "14h00", "15h00", "16h00", "17h00"];
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  useEffect(() => {
    const userStr = localStorage.getItem("acadex_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      setRole(getRoleFromId(u.id));
    }
  }, []);

  const schedulesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "schedules"), orderBy("createdAt", "asc"));
  }, [db]);

  const { data: schedules, loading } = useCollection(schedulesQuery);

  const getCourse = (day: string, hour: string) => {
    return schedules?.find((c: any) => c.day === day && c.startTime === hour);
  };

  const handleSaveSlot = () => {
    if (!db || !formData.subject || !formData.room) return;

    const slotId = `${formData.day}-${formData.startTime}`.replace(/\s+/g, '-');
    const slotRef = doc(db, "schedules", slotId);
    
    const data = {
      ...formData,
      id: slotId,
      updatedBy: user.name,
      createdAt: serverTimestamp(),
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    };

    setDoc(slotRef, data, { merge: true })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: slotRef.path,
          operation: 'write',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({ title: "Horaire mis à jour", description: "Le créneau a été enregistré spontanément." });
    setIsEditing(false);
    setFormData({ day: "Lun", startTime: "07h00", endTime: "08h00", subject: "", room: "", teacher: "" });
  };

  const handleDeleteSlot = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "schedules", id))
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `schedules/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    toast({ variant: "destructive", title: "Créneau supprimé" });
  };

  const canEdit = role === 'DIRECTOR' || role === 'TEACHER';

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-12 animate-fade-up max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
          <div className="text-left w-full">
            <h1 className="text-3xl md:text-7xl font-headline font-black text-[#0F172A] mb-1 tracking-tighter uppercase leading-none">Planning Élite</h1>
            <p className="text-[#0F172A] text-[9px] md:text-2xl font-black opacity-80 uppercase tracking-[0.4em]">Hebdomadaire • 2026-2027</p>
          </div>
          
          {canEdit && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-xl transition-all border-2 border-white/10 w-full md:w-auto text-[10px] md:text-base uppercase tracking-tighter shrink-0">
                  <Plus className="w-7 h-7 md:w-8 md:h-8 mr-2" /> Nouveau Créneau
                </Button>
              </DialogTrigger>
              <DialogContent className="vivid-box border-none bg-white p-0 overflow-hidden rounded-[2.5rem] sm:max-w-[480px]">
                <DialogHeader className="p-6 bg-primary text-white border-b-2 border-accent">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-lg rotate-3 shrink-0">
                        <Clock className="w-7 h-7 text-primary" />
                      </div>
                      <DialogTitle className="text-xl font-black tracking-tighter uppercase leading-none">Nouvelle Séance</DialogTitle>
                   </div>
                </DialogHeader>
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-[#0F172A] tracking-widest ml-1">Jour de la semaine</Label>
                      <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: v})}>
                        <SelectTrigger className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm text-[#0F172A] shadow-inner"><SelectValue /></SelectTrigger>
                        <SelectContent>{days.map(d => <SelectItem key={d} value={d} className="font-bold">{d}</SelectItem>)}</SelectContent>
                      </Select>
                   </div>

                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-[#0F172A] tracking-widest ml-1">Début</Label>
                        <Select value={formData.startTime} onValueChange={(v) => setFormData({...formData, startTime: v})}>
                          <SelectTrigger className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm text-[#0F172A] shadow-inner"><SelectValue /></SelectTrigger>
                          <SelectContent>{hours.map(h => <SelectItem key={h} value={h} className="font-bold">{h}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-[#0F172A] tracking-widest ml-1">Fin</Label>
                        <Select value={formData.endTime} onValueChange={(v) => setFormData({...formData, endTime: v})}>
                          <SelectTrigger className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm text-[#0F172A] shadow-inner"><SelectValue /></SelectTrigger>
                          <SelectContent>{hours.map(h => <SelectItem key={h} value={h} className="font-bold">{h}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-[#0F172A] tracking-widest ml-1">Matière / Enseignement</Label>
                      <Input 
                        placeholder="Ex: Mathématiques"
                        className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm text-[#0F172A] shadow-inner" 
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-[#0F172A] tracking-widest ml-1">Salle & Professeur</Label>
                      <Input 
                        className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm text-[#0F172A] shadow-inner" 
                        placeholder="Ex: Salle S01 - M. Kouassi" 
                        value={formData.room} 
                        onChange={e => setFormData({...formData, room: e.target.value})} 
                      />
                   </div>
                </div>
                <DialogFooter className="p-8 pt-0">
                  <Button className="w-full h-16 bg-primary text-white font-black rounded-xl uppercase shadow-xl border-2 border-white/10 text-sm tracking-tighter" onClick={handleSaveSlot}>
                    Enregistrer Spontanément
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Schedule Grid */}
        <Card className="vivid-box border-none shadow-2xl overflow-hidden bg-white/95 p-0 rounded-[2.5rem] md:rounded-[4rem]">
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[1000px] md:min-w-full">
              {/* Header Days */}
              <div className="grid grid-cols-7 bg-slate-900 border-b-4 border-white/5">
                <div className="p-6 md:p-10 text-center border-r-2 border-white/5 flex items-center justify-center">
                   <Clock className="w-8 h-8 md:w-10 md:h-10 text-white/30" />
                </div>
                {days.map(day => (
                  <div key={day} className="p-6 md:p-10 text-center border-r-2 border-white/5 last:border-r-0">
                    <p className="text-[12px] md:text-3xl font-headline font-black text-white uppercase tracking-tighter">{day}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="divide-y-2 divide-slate-100">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-7 min-h-[120px] md:min-h-[220px]">
                    {/* Time Column */}
                    <div className="flex items-center justify-center border-r-2 border-slate-100 bg-slate-50/50">
                      <span className="text-[11px] md:text-2xl font-black text-[#0F172A] font-mono tracking-tighter opacity-40">{hour}</span>
                    </div>

                    {/* Day Slots */}
                    {days.map(day => {
                      const course = getCourse(day, hour);
                      return (
                        <div key={`${day}-${hour}`} className="p-2 md:p-6 border-r-2 border-slate-100 last:border-r-0 relative group bg-white">
                          {course ? (
                            <div className="h-full w-full rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border-4 shadow-2xl flex flex-col justify-between overflow-hidden transition-all group-hover:scale-[1.03] bg-white border-slate-50">
                              <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1 min-w-0">
                                   <div className="flex items-center gap-2 text-[8px] md:text-[12px] font-black text-primary uppercase tracking-widest leading-none mb-1.5">
                                      <Clock className="w-5 h-5 md:w-6 md:h-6" />
                                      <span>{course.startTime} - {course.endTime}</span>
                                   </div>
                                   <p className="text-[11px] md:text-xl font-black uppercase text-[#0F172A] leading-tight truncate tracking-tighter">{course.subject}</p>
                                </div>
                                {canEdit && (
                                  <button onClick={() => handleDeleteSlot(course.id)} className="text-slate-200 hover:text-red-500 transition-colors p-1.5">
                                    <Trash2 className="w-6 h-6 md:w-7 md:h-7" />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[8px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest mt-auto border-t border-slate-50 pt-3 md:pt-6">
                                <MapPin className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-primary" />
                                <span className="truncate">{course.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                               <Plus className="w-8 h-8 text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
