"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { BrainCircuit, X, Send, Sparkles, Loader2, MessageSquare, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { askAcademicAssistant } from "@/ai/flows/academic-assistant-flow";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  advice?: string;
  action?: string;
}

export const AcademicAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();

  // Fetch contextual data for the AI
  const studentsQuery = useMemo(() => db ? query(collection(db, "students"), limit(100)) : null, [db]);
  const gradesQuery = useMemo(() => db ? query(collection(db, "grades"), limit(100)) : null, [db]);
  const schedulesQuery = useMemo(() => db ? query(collection(db, "schedules"), limit(50)) : null, [db]);

  const { data: students } = useCollection(studentsQuery);
  const { data: grades } = useCollection(gradesQuery);
  const { data: schedules } = useCollection(schedulesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const userStr = localStorage.getItem("acadex_user");
      const user = userStr ? JSON.parse(userStr) : { id: "GUEST", name: "Anonyme", role: "GUEST" };

      const result = await askAcademicAssistant({
        query: userMsg,
        context: {
          students: students || [],
          grades: grades || [],
          schedules: schedules || [],
          userName: user.name,
          userRole: user.role,
          userId: user.id
        }
      });

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: result.answer,
        advice: result.advice,
        action: result.suggestedAction
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Désolé, je rencontre une difficulté technique. Réessayez dans un instant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 border-4 border-white/20",
          isOpen ? "bg-[#0F172A] rotate-90" : "bg-primary hover:bg-[#0F172A]"
        )}
      >
        {isOpen ? <X className="w-12 h-12 md:w-16 md:h-16 text-white" /> : <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-white" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-accent rounded-full animate-pulse border-4 border-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-32 right-6 z-50 w-[340px] md:w-[500px] h-[600px] md:h-[750px] vivid-box border-none shadow-[0_50px_150px_-20px_rgba(0,0,0,0.4)] bg-white/95 backdrop-blur-3xl flex flex-col p-0 overflow-hidden rounded-[3rem]">
          <CardHeader className="p-8 bg-primary text-white border-b-4 border-accent relative">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-xl rotate-3">
                <BrainCircuit className="w-10 h-10 md:w-14 md:h-14 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">Conseiller IA</CardTitle>
                <p className="text-[12px] font-black uppercase tracking-widest text-white/70 mt-2">Pilotage Sécurisé 2026-2027</p>
              </div>
            </div>
          </CardHeader>

          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 sidebar-scroll bg-slate-50/20">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-inner border-2 border-slate-100">
                  <Sparkles className="w-14 h-14 text-primary" />
                </div>
                <p className="text-[12px] md:text-base font-black text-[#0F172A] uppercase tracking-widest leading-relaxed max-w-[280px]">
                  Bonjour ! Je suis prêt à analyser vos données scolaires en toute sécurité.
                </p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col w-full animate-fade-up", m.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[90%] p-6 md:p-8 rounded-[2rem] shadow-xl text-[14px] md:text-lg font-black leading-snug",
                  m.role === 'user' 
                    ? "bg-[#0F172A] text-white rounded-tr-none" 
                    : "bg-white text-[#0F172A] border-2 border-slate-50 rounded-tl-none"
                )}>
                  {m.text}
                </div>
                
                {m.advice && (
                  <div className="mt-5 w-[95%] bg-primary/5 border-l-8 border-accent p-6 rounded-2xl space-y-4 animate-in slide-in-from-left-2">
                    <div className="flex items-center gap-4 text-primary">
                      <Lightbulb className="w-8 h-8 text-accent" />
                      <span className="text-[12px] font-black uppercase tracking-widest">Conseil Stratégique</span>
                    </div>
                    <p className="text-[13px] md:text-base font-bold text-[#0F172A] italic leading-tight">
                      "{m.advice}"
                    </p>
                  </div>
                )}

                {m.action && (
                  <div className="mt-4 w-fit">
                    <Button variant="outline" className="h-12 rounded-xl border-4 border-slate-100 bg-white text-[10px] md:text-sm font-black uppercase tracking-widest text-primary gap-4 shadow-lg px-6">
                      {m.action} <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-4 border-slate-50 p-8 rounded-3xl rounded-tl-none shadow-xl flex items-center gap-6">
                  <div className="relative w-10 h-10">
                    <Loader2 className="w-10 h-10 animate-spin text-primary absolute" />
                    <Sparkles className="w-6 h-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[12px] md:text-base font-black uppercase tracking-widest text-primary">Cryptage en cours...</span>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-6 bg-white border-t-8 border-slate-50">
            <form onSubmit={handleSend} className="flex gap-5">
              <Input
                placeholder="Votre question personnelle..."
                className="h-16 md:h-20 bg-slate-50 border-4 border-slate-100 rounded-2xl font-black text-sm md:text-xl text-[#0F172A] px-8 focus-visible:ring-8 focus-visible:ring-primary/5 transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-[#0F172A] text-white w-16 md:w-24 h-16 md:h-20 rounded-2xl shadow-2xl shrink-0 border-4 border-white/10 transition-transform active:scale-90 flex items-center justify-center"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-8 h-8 md:w-12 md:h-12" />
              </button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};
