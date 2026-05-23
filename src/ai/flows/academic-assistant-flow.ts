'use server';
/**
 * @fileOverview Assistant Académique Global pour ACADEX.
 * 
 * - askAcademicAssistant - Gère les requêtes sur les données scolaires.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AcademicAssistantInputSchema = z.object({
  query: z.string().describe('La question de l\'utilisateur sur les données de l\'école.'),
  context: z.object({
    students: z.array(z.any()).optional(),
    grades: z.array(z.any()).optional(),
    schedules: z.array(z.any()).optional(),
    userName: z.string().optional(),
    userRole: z.string().optional(),
  }).describe('Le contexte de données actuel de l\'application pour répondre précisément.'),
});
export type AcademicAssistantInput = z.infer<typeof AcademicAssistantInputSchema>;

const AcademicAssistantOutputSchema = z.object({
  answer: z.string().describe('La réponse de l\'IA en français, précise et pédagogique.'),
  suggestedAction: z.string().optional().describe('Une action ou page suggérée suite à la réponse.'),
});
export type AcademicAssistantOutput = z.infer<typeof AcademicAssistantOutputSchema>;

export async function askAcademicAssistant(input: AcademicAssistantInput): Promise<AcademicAssistantOutput> {
  return academicAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'academicAssistantPrompt',
  input: { schema: AcademicAssistantInputSchema },
  output: { schema: AcademicAssistantOutputSchema },
  prompt: `Tu es l'Expert Académique ACADEX, un assistant IA d'élite pour une plateforme scolaire au Bénin.
Ton rôle est de répondre aux questions sur les élèves, les notes, et les emplois du temps en utilisant le contexte fourni.

CONTEXTE ACTUEL :
Utilisateur: {{{context.userName}}} (Rôle: {{{context.userRole}}})
Session: 2026-2027

DONNÉES DISPONIBLES :
- Élèves: {{#each context.students}}{{{lastName}}} {{{firstName}}} (ID: {{{id}}}, Classe: {{{gradeLevel}}}), {{/each}}
- Notes: {{#each context.grades}}{{{studentName}}} en {{{subjectName}}}: {{{value}}}/20 ({{{type}}}), {{/each}}
- Emploi du Temps: {{#each context.schedules}}{{{day}}} {{{startTime}}}-{{{endTime}}}: {{{subject}}} (Salle: {{{room}}}), {{/each}}

QUESTION : {{{query}}}

CONSIGNES :
1. Sois précis : Si on demande la note de Michel, cherche "Michel" dans les données des notes.
2. Sois pédagogique : Encourage l'excellence.
3. Si l'information n'est pas dans le contexte, dis poliment que tu n'as pas encore accès à cette donnée spécifique pour 2026-2027.
4. Réponds toujours en Français.
`
});

const academicAssistantFlow = ai.defineFlow(
  {
    name: 'academicAssistantFlow',
    inputSchema: AcademicAssistantInputSchema,
    outputSchema: AcademicAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
