"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BrainCircuit, X, Send, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { askAcademicAssistant } from "@/ai/flows/academic-assistant-flow";
import { cn } from "@/lib/utils";

export const AcademicAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const db = useFirestore();

  // Fetch contextual data for the AI
  const studentsQuery = useMemo(() => db ? query(collection(db, "students"), limit(50)) : null, [db]);
  const gradesQuery = useMemo(() => db ? query(collection(db, "grades"), limit(50)) : null, [db]);
  const schedulesQuery = useMemo(() => db ? query(collection(db, "schedules"), limit(50)) : null, [db]);

  const { data: students } = useCollection(studentsQuery);
  const { data: grades } = useCollection(gradesQuery);
  const { data: schedules } = useCollection(schedulesQuery);

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

      setMessages(prev => [...prev, { role: 'ai', text: result.answer }]);
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
          "fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 border-4 border-white/20",
          isOpen ? "bg-slate-900 rotate-90" : "bg-primary hover:bg-slate-900"
        )}
      >
        {isOpen ? <X className="w-8 h-8 md:w-10 md:h-10 text-white" /> : <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-white" />}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse border-2 border-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[320px] md:w-[400px] h-[500px] md:h-[600px] vivid-box border-none shadow-[0_40px_120px_-15px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-xl flex flex-col p-0 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="p-6 bg-primary text-white border-b-4 border-accent">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-lg rotate-3">
                <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl font-black tracking-tighter uppercase leading-none">Conseiller IA</CardTitle>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mt-1">Expert Académique ACADEX</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 sidebar-scroll bg-slate-50/30">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Sparkles className="w-12 h-12 text-primary" />
                <p className="text-xs font-black text-[#0F172A] uppercase tracking-widest leading-relaxed">
                  Bonjour ! Posez-moi vos questions <br/> sur les notes ou le planning.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-4 rounded-2xl shadow-md text-xs md:text-sm font-bold leading-snug",
                  m.role === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white text-[#0F172A] border-2 border-slate-100 rounded-tl-none italic"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-md flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Analyse en cours...</span>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 bg-white border-t-2 border-slate-50">
            <form onSubmit={handleSend} className="flex gap-3">
              <Input
                placeholder="Question (ex: Michel Math...)"
                className="h-12 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs md:text-sm text-[#0F172A] px-4 focus-visible:ring-2 focus-visible:ring-primary/20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-slate-900 text-white w-12 h-12 rounded-xl shadow-lg shrink-0"
                disabled={isLoading}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};
