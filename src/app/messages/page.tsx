
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquare, Search, Send, Paperclip, MoreHorizontal, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function MessagingPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("acadex_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const messagesQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );
  }, [db]);

  const { data: messages, loading } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !currentUser || !newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: serverTimestamp(),
    };

    setNewMessage(""); // Spontané : on vide le champ immédiatement

    addDoc(collection(db, "messages"), messageData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'messages',
          operation: 'create',
          requestResourceData: messageData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer le message."
        });
      });
  };

  const contacts = [
    { name: "Direction ACADEX", lastMsg: messages?.[messages.length - 1]?.text || "Bienvenue...", time: "En ligne" },
    { name: "Espace Général", lastMsg: "Discussion ouverte", time: "Actif" },
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-4 md:gap-8 animate-fade-up max-w-full overflow-hidden">
        
        <Card className="hidden lg:flex w-80 vivid-box border-none shadow-2xl flex-col bg-white overflow-hidden p-0 rounded-[2rem]">
          <div className="p-6 border-b-2 border-slate-50">
            <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tighter mb-4">Conversations</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <Input placeholder="Rechercher..." className="pl-10 bg-slate-50 border-2 border-slate-100 rounded-xl h-10 font-bold text-[#0F172A] text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            {contacts.map((c, i) => (
              <div key={i} className="p-4 hover:bg-primary/5 cursor-pointer transition-all border-b border-slate-50 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-105 transition-transform shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-[11px] font-black text-[#0F172A] truncate uppercase">{c.name}</p>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{c.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 truncate opacity-70">{c.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex-1 vivid-box border-none shadow-2xl flex-col bg-white/95 backdrop-blur-xl overflow-hidden p-0 flex rounded-[2rem]">
          <div className="p-4 md:p-6 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm md:text-lg shadow-xl shrink-0">
                D
              </div>
              <div>
                <p className="text-sm md:text-xl font-black text-[#0F172A] tracking-tighter uppercase">Direction ACADEX</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Canal Officiel Sécurisé</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary"><MoreHorizontal className="w-6 h-6" /></Button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 md:p-8 overflow-y-auto space-y-4 bg-slate-50/20 sidebar-scroll">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-[#0F172A] font-black uppercase tracking-[0.2em] text-[8px]">Cryptage des données...</p>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
                <MessageSquare className="w-16 h-16 text-slate-200" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aucun message pour le moment</p>
              </div>
            ) : (
              messages?.map((m: any, i) => {
                const isMine = m.senderId === currentUser?.id;
                return (
                  <div key={i} className={cn("flex w-full group animate-fade-up", isMine ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] md:max-w-[70%] p-3 md:p-5 rounded-[1.5rem] shadow-xl relative",
                      isMine 
                        ? "bg-primary text-white rounded-tr-none border-b-2 border-slate-900/20" 
                        : "bg-white text-[#0F172A] rounded-tl-none border border-slate-100"
                    )}>
                      {!isMine && <p className="text-[7px] font-black text-accent uppercase tracking-widest mb-1">{m.senderName}</p>}
                      <p className={cn("text-[11px] md:text-sm font-bold leading-snug", isMine ? "text-white" : "text-[#0F172A]")}>{m.text}</p>
                      <div className={cn(
                        "text-[6px] md:text-[8px] font-black uppercase mt-1 opacity-50 text-right",
                        isMine ? "text-white" : "text-slate-400"
                      )}>
                        {m.timestamp ? format(m.timestamp.toDate(), "HH:mm", { locale: fr }) : "..."}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 md:p-6 border-t-2 border-slate-50 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-4 md:gap-5 items-center">
              <Button type="button" variant="ghost" size="icon" className="hidden sm:flex text-slate-400 hover:text-primary h-10 w-10 rounded-xl">
                <Paperclip className="w-5.5 h-5.5" />
              </Button>
              <div className="flex-1 relative">
                <Input 
                  placeholder="Écrivez votre message..." 
                  className="h-10 md:h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs md:text-sm text-[#0F172A] px-4 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-slate-900 text-white font-black h-10 md:h-12 w-10 md:w-16 rounded-xl shadow-xl transition-all active:scale-90 border-2 border-white/10"
                disabled={!newMessage.trim()}
              >
                <Send className="w-6 h-6" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
