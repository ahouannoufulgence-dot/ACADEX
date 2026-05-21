"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquare, Search, Send, Paperclip, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagingPage() {
  const contacts = [
    { name: "Direction ACADEX", lastMsg: "La réunion est confirmée...", time: "10:30", unread: 2 },
    { name: "M. Kouassi (Maths)", lastMsg: "Les notes sont prêtes.", time: "Hier", unread: 0 },
    { name: "Parents 3ème A", lastMsg: "Merci pour l'information.", time: "Hier", unread: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-160px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="w-80 glass-card border-none shadow-xl flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-10 bg-white/5 border-white/10 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c, i) => (
              <div key={i} className="p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate flex-1 pr-4">{c.lastMsg}</p>
                  {c.unread > 0 && <span className="bg-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex-1 glass-card border-none shadow-xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">D</div>
              <p className="text-sm font-bold text-white">Direction ACADEX</p>
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[70%]">
                <p className="text-xs text-white">Bonjour, veuillez noter que le conseil de classe est maintenu pour vendredi prochain à 15h.</p>
                <p className="text-[8px] text-muted-foreground mt-1 text-right">09:12</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary rounded-2xl rounded-tr-none p-3 max-w-[70%]">
                <p className="text-xs text-white">C'est bien noté. Je préparerai les rapports d'absences d'ici là.</p>
                <p className="text-[8px] text-white/60 mt-1 text-right">09:45</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground"><Paperclip className="w-4 h-4" /></Button>
              <Input placeholder="Votre message..." className="bg-white/5 border-white/10" />
              <Button className="bg-accent text-black"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}