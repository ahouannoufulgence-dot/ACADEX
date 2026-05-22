'use server';
/**
 * @fileOverview A pedagogical analysis AI agent for ACADEX.
 *
 * - analyzeStudentPerformance - Function to analyze grades and provide advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GradeItemSchema = z.object({
  subject: z.string(),
  value: z.number(),
  coefficient: z.number(),
  classAverage: z.number().optional(),
});

const PedagogicalAnalysisInputSchema = z.object({
  studentName: z.string(),
  gradeLevel: z.string(),
  overallAverage: z.number(),
  grades: z.array(GradeItemSchema),
});
export type PedagogicalAnalysisInput = z.infer<typeof PedagogicalAnalysisInputSchema>;

const PedagogicalAnalysisOutputSchema = z.object({
  strengths: z.array(z.string()).describe('List of subjects or skills where the student excels.'),
  weaknesses: z.array(z.string()).describe('List of subjects or areas needing improvement.'),
  advice: z.string().describe('Tailored pedagogical advice in French, encouraging and constructive.'),
  overallAssessment: z.string().describe('A brief summary of the student\'s term performance.'),
});
export type PedagogicalAnalysisOutput = z.infer<typeof PedagogicalAnalysisOutputSchema>;

export async function analyzeStudentPerformance(input: PedagogicalAnalysisInput): Promise<PedagogicalAnalysisOutput> {
  return pedagogicalAnalysisFlow(input);
}

const pedagogicalPrompt = ai.definePrompt({
  name: 'pedagogicalAnalysisPrompt',
  input: { schema: PedagogicalAnalysisInputSchema },
  output: { schema: PedagogicalAnalysisOutputSchema },
  prompt: `Tu es un conseiller pédagogique expert pour ACADEX, une plateforme scolaire d'élite au Bénin.
Ton rôle est d'analyser les résultats d'un élève et de lui donner des conseils motivants et précis en français.

Informations de l'élève :
Nom: {{{studentName}}}
Niveau: {{{gradeLevel}}}
Moyenne Générale: {{{overallAverage}}} / 20

Notes détaillées :
{{#each grades}}
- {{{subject}}}: {{{value}}}/20 (Coefficient: {{{coefficient}}}, Moyenne classe: {{{classAverage}}})
{{/each}}

Instructions :
1. Identifie les forces (matières avec notes > 14 ou au-dessus de la moyenne de classe).
2. Identifie les points de vigilance (matières avec notes < 10 ou en dessous de la moyenne de classe).
3. Donne un conseil concret pour le prochain trimestre (méthodologie, organisation, etc.).
4. Garde un ton bienveillant, formel et encourageant.
`
});

const pedagogicalAnalysisFlow = ai.defineFlow(
  {
    name: 'pedagogicalAnalysisFlow',
    inputSchema: PedagogicalAnalysisInputSchema,
    outputSchema: PedagogicalAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await pedagogicalPrompt(input);
    return output!;
  }
);
