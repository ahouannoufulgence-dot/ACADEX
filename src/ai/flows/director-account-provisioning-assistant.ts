'use server';
/**
 * @fileOverview This file defines a Genkit flow for assisting Directors in provisioning new user accounts.
 *
 * - provisionUserAccount - A function that handles the account provisioning process with AI suggestions.
 * - DirectorAccountProvisioningInput - The input type for the provisionUserAccount function.
 * - DirectorAccountProvisioningOutput - The return type for the provisionUserAccount function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DirectorAccountProvisioningInputSchema = z.object({
  userType: z.enum(['DIRECTOR', 'ENSEIGNANT', 'ELEVE', 'PARENT']).describe('The type of user being provisioned (DIRECTOR, ENSEIGNANT, ELEVE, or PARENT).'),
  firstName: z.string().describe('The first name of the user.'),
  lastName: z.string().describe('The last name of the user.'),
  subject: z.string().optional().describe('For ENSEIGNANT user types, the subject they will teach. E.g., "Mathématiques", "Physique-Chimie".'),
  gradeLevel: z.string().optional().describe('For ELEVE user types, their grade level or class. E.g., "3ème D", "1ère Scientifique".'),
  parentName: z.string().optional().describe('For ELEVE user types, the full name of their parent.'),
  additionalContext: z.string().optional().describe('Any additional context for the AI to consider, such as specific class preferences or unique situations.'),
});
export type DirectorAccountProvisioningInput = z.infer<typeof DirectorAccountProvisioningInputSchema>;

const DirectorAccountProvisioningOutputSchema = z.object({
  suggestedId: z.string().describe('A unique user ID based on the user type and school conventions (e.g., DIR-001, ENS-MATH-001, ELV-3D-001, PAR-001). The number part should be a three-digit number, e.g., 001, 002, etc.'),
  suggestedAssignments: z.string().optional().describe('For ENSEIGNANT user types, suggested class and subject assignments based on the provided subject or additional context.'),
  draftWelcomeMessage: z.string().describe('A draft welcome message in French for the new user, tailored to their role and information, maintaining a friendly tone and mentioning ACADEX.'),
});
export type DirectorAccountProvisioningOutput = z.infer<typeof DirectorAccountProvisioningOutputSchema>;

export async function provisionUserAccount(input: DirectorAccountProvisioningInput): Promise<DirectorAccountProvisioningOutput> {
  return directorAccountProvisioningAssistantFlow(input);
}

const provisionUserAccountPrompt = ai.definePrompt({
  name: 'provisionUserAccountPrompt',
  input: { schema: DirectorAccountProvisioningInputSchema },
  output: { schema: DirectorAccountProvisioningOutputSchema },
  prompt: `You are an AI assistant for ACADEX, a school management platform in Bénin, operating in French. Your role is to help the Director efficiently provision new user accounts. You will generate a unique user ID, propose assignments (if applicable), and draft a welcome message for new users based on the provided information and school conventions.

The user ID should follow these conventions:
- DIRECTOR: "DIR-", followed by a unique three-digit number (e.g., DIR-001).
- ENSEIGNANT: "ENS-", followed by a shortened subject code (e.g., "MATH" for Mathématiques, "PHYCHIM" for Physique-Chimie), then "-", followed by a unique three-digit number (e.g., ENS-MATH-001). If subject is not provided, use a generic code like "GEN".
- ELEVE: "ELV-", followed by a shortened grade code (e.g., "3D" for 3ème D, "1SCI" for 1ère Scientifique), then "-", followed by a unique three-digit number (e.g., ELV-3D-001). If grade level is not provided, use a generic code like "GEN".
- PARENT: "PAR-", followed by a unique three-digit number (e.g., PAR-001).

Always respond in French for the welcome message, which should be friendly and mention ACADEX.

Here is the information for the new user account:
Type d'utilisateur: {{{userType}}}
Prénom: {{{firstName}}}
Nom: {{{lastName}}}
{{#if subject}}Matière enseignée: {{{subject}}}{{/if}}
{{#if gradeLevel}}Niveau scolaire: {{{gradeLevel}}}{{/if}}
{{#if parentName}}Nom du parent (si élève): {{{parentName}}}{{/if}}
{{#if additionalContext}}Contexte additionnel: {{{additionalContext}}}{{/if}}

Veuillez générer l'identifiant suggéré, les affectations suggérées (si applicable pour les enseignants) et un brouillon de message de bienvenue.
`
});

const directorAccountProvisioningAssistantFlow = ai.defineFlow(
  {
    name: 'directorAccountProvisioningAssistantFlow',
    inputSchema: DirectorAccountProvisioningInputSchema,
    outputSchema: DirectorAccountProvisioningOutputSchema,
  },
  async (input) => {
    const { output } = await provisionUserAccountPrompt(input);
    return output!;
  }
);
