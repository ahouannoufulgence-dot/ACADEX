
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
  const studentsQuery = useMemo(() => db ? query(collection(db, "students"), limit(50)) : null, [db]);
  const gradesQuery = useMemo(() => db ? query(collection(db, "grades"), limit(50)) : null, [db]);
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
      const user = userStr ? JSON.parse(userStr) : { name: "Anonyme", role: "GUEST" };

      const result = await askAcademicAssistant({
        query: userMsg,
        context: {
          students: students || [],
          grades: grades || [],
          schedules: schedules || [],
          userName: user.name,
          userRole: user.role
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
          "fixed bottom-6 right-6 z-50 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 border-4 border-white/20",
          isOpen ? "bg-[#0F172A] rotate-90" : "bg-primary hover:bg-[#0F172A]"
        )}
      >
        {isOpen ? <X className="w-10 h-10 md:w-12 md:h-12 text-white" /> : <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-white" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-accent rounded-full animate-pulse border-2 border-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[320px] md:w-[450px] h-[550px] md:h-[700px] vivid-box border-none shadow-[0_50px_150px_-20px_rgba(0,0,0,0.4)] bg-white/95 backdrop-blur-3xl flex flex-col p-0 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="p-6 bg-primary text-white border-b-4 border-accent relative">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white rounded-xl shadow-lg rotate-3">
                <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Conseiller IA</CardTitle>
                <p className="text-[11px] font-black uppercase tracking-widest text-white/70 mt-1">Pilotage Pédagogique 2026-2027</p>
              </div>
            </div>
          </CardHeader>

          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 sidebar-scroll bg-slate-50/20">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 opacity-40">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner border-2 border-slate-100">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <p className="text-[11px] md:text-sm font-black text-[#0F172A] uppercase tracking-widest leading-relaxed max-w-[240px]">
                  Bonjour ! Je peux analyser vos notes et vous proposer des conseils stratégiques.
                </p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col w-full animate-fade-up", m.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[90%] p-4 md:p-6 rounded-[1.5rem] shadow-xl text-[13px] md:text-base font-black leading-snug",
                  m.role === 'user' 
                    ? "bg-[#0F172A] text-white rounded-tr-none" 
                    : "bg-white text-[#0F172A] border-2 border-slate-50 rounded-tl-none"
                )}>
                  {m.text}
                </div>
                
                {m.advice && (
                  <div className="mt-4 w-[95%] bg-primary/5 border-l-4 border-accent p-5 rounded-xl space-y-3 animate-in slide-in-from-left-2">
                    <div className="flex items-center gap-3 text-primary">
                      <Lightbulb className="w-6 h-6 text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Conseil Stratégique</span>
                    </div>
                    <p className="text-[12px] md:text-sm font-bold text-[#0F172A] italic leading-tight">
                      "{m.advice}"
                    </p>
                  </div>
                )}

                {m.action && (
                  <div className="mt-3 w-fit">
                    <Button variant="outline" className="h-10 rounded-lg border-2 border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-primary gap-3 shadow-md px-5">
                      {m.action} <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-slate-50 p-6 rounded-2xl rounded-tl-none shadow-xl flex items-center gap-5">
                  <div className="relative w-8 h-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary absolute" />
                    <Sparkles className="w-4 h-4 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">Analyse en cours...</span>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-5 bg-white border-t-4 border-slate-50">
            <form onSubmit={handleSend} className="flex gap-4">
              <Input
                placeholder="Posez votre question..."
                className="h-12 md:h-16 bg-slate-50 border-4 border-slate-100 rounded-xl font-black text-xs md:text-lg text-[#0F172A] px-6 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-[#0F172A] text-white w-12 md:w-16 h-12 md:h-16 rounded-xl shadow-2xl shrink-0 border-4 border-white/10 transition-transform active:scale-90 flex items-center justify-center"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-7 h-7 md:w-9 md:h-9" />
              </button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};
