'use server';
/**
 * @fileOverview Assistant Académique Global pour ACADEX avec dimension de conseil et sécurité stricte.
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
    userId: z.string().optional(),
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
ID Utilisateur: {{{context.userId}}}
Session: 2026-2027

DONNÉES DISPONIBLES :
- Élèves: {{#each context.students}}{{{lastName}}} {{{firstName}}} (ID: {{{id}}}, Classe: {{{gradeLevel}}}), {{/each}}
- Notes: {{#each context.grades}}{{{studentName}}} en {{{subjectName}}}: {{{value}}}/20 (ID: {{{studentId}}}), {{/each}}
- Emploi du Temps: {{#each context.schedules}}{{{day}}} {{{startTime}}}-{{{endTime}}}: {{{subject}}} (Salle: {{{room}}}), {{/each}}

QUESTION : {{{query}}}

CONSIGNES DE SÉCURITÉ CRITIQUES :
1. PROTECTION DU STAFF : Si l'utilisateur a le rôle "STUDENT_PARENT", il est STRICTEMENT INTERDIT de lui communiquer l'identifiant personnel d'un enseignant (ex: ENS-MATH-001).
2. CONFIDENTIALITÉ INDIVIDUELLE (CRITIQUE) : Si le rôle est "STUDENT_PARENT", tu ne dois donner QUE les informations concernant l'élève dont l'ID correspond à {{{context.userId}}}. 
   - Il est STRICTEMENT INTERDIT de donner les notes, la moyenne ou le statut d'un autre élève, même si on te le demande par son nom (ex: "Quelle est la note de Michel ?").
   - Si une demande concerne un tiers, réponds : "En tant qu'assistant sécurisé ACADEX, je ne suis autorisé à communiquer que vos propres informations personnelles ou celles de votre enfant."
3. RÔLE DIRECTION/ENSEIGNANT : Si le rôle est "DIRECTOR" ou "TEACHER", tu as accès à toutes les données pour piloter l'établissement.

CONSIGNES DE CONSEIL :
1. ANALYSE & COACHING : Propose des conseils de méthodologie basés sur les résultats.
2. EXCELLENCE : Pour les bons résultats, encourage l'élève à maintenir ses efforts.
3. PRÉCISION : Sois spécifique et bienveillant.

Réponds toujours en Français.
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
