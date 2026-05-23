'use server';
/**
 * @fileOverview Assistant Académique Global pour ACADEX avec dimension de conseil.
 * 
 * - askAcademicAssistant - Gère les requêtes sur les données et prodigue des conseils.
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
  advice: z.string().optional().describe('Conseils pédagogiques ou méthodologiques personnalisés.'),
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
Ton rôle est de répondre aux questions sur les élèves, les notes, et les emplois du temps, tout en agissant comme un conseiller pédagogique.

CONTEXTE ACTUEL :
Utilisateur: {{{context.userName}}} (Rôle: {{{context.userRole}}})
Session: 2026-2027

DONNÉES DISPONIBLES :
- Élèves: {{#each context.students}}{{{lastName}}} {{{firstName}}} (ID: {{{id}}}, Classe: {{{gradeLevel}}}), {{/each}}
- Notes: {{#each context.grades}}{{{studentName}}} en {{{subjectName}}}: {{{value}}}/20 ({{{type}}}), {{/each}}
- Emploi du Temps: {{#each context.schedules}}{{{day}}} {{{startTime}}}-{{{endTime}}}: {{{subject}}} (Salle: {{{room}}}), {{/each}}

QUESTION : {{{query}}}

CONSIGNES DE SÉCURITÉ CRITIQUES :
1. PROTECTION DU STAFF : Si l'utilisateur a le rôle "STUDENT_PARENT" (Élève/Parent), il est STRICTEMENT INTERDIT de lui communiquer l'identifiant personnel d'un enseignant (ex: ENS-MATH-001). Si on te le demande, réponds poliment que "L'identifiant personnel d'un membre du corps enseignant est une donnée confidentielle réservée à l'administration."
2. CONFIDENTIALITÉ : Ne donne les notes d'un élève que si on te le demande précisément.

CONSIGNES DE CONSEIL :
1. ANALYSE & COACHING : Si tu identifies une baisse de note ou une difficulté, propose un conseil de méthodologie (ex: "Révision par fiches", "Entraînement quotidien en calcul").
2. EXCELLENCE : Pour les bons résultats, encourage l'élève à maintenir ses efforts et propose des défis supplémentaires.
3. PRÉCISION : Sois spécifique. Ne dis pas "Travaille plus", dis "Consacre 20 minutes de plus à la lecture le soir".

CONSIGNES GÉNÉRALES :
1. Sois précis : Si on demande la note de Michel, cherche "Michel" dans les données des notes.
2. Sois pédagogique : Encourage l'excellence et garde un ton formel, bienveillant et inspirant.
3. Réponds toujours en Français.
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
