'use server';

/**
 * @fileOverview Generates a custom soundtrack based on user-selected genre and mood.
 *
 * - generateSoundtrack - A function that generates a soundtrack.
 * - GenerateSoundtrackInput - The input type for the generateSoundtrack function.
 * - GenerateSoundtrackOutput - The return type for the generateSoundtrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundtrackInputSchema = z.object({
  genre: z.string().describe('The genre of the soundtrack.'),
  mood: z.string().describe('The mood of the soundtrack.'),
  lengthMinutes: z.number().min(1).max(3).default(1).describe('The length of the soundtrack in minutes.'),
});
export type GenerateSoundtrackInput = z.infer<typeof GenerateSoundtrackInputSchema>;

const GenerateSoundtrackOutputSchema = z.object({
  description: z.string().describe('A description of the generated soundtrack, including BPM, key, instruments used, and mood tags.'),
  audioDataUri: z.string().optional().describe('The generated soundtrack as a data URI in base64 format.'),
});
export type GenerateSoundtrackOutput = z.infer<typeof GenerateSoundtrackOutputSchema>;

export async function generateSoundtrack(input: GenerateSoundtrackInput): Promise<GenerateSoundtrackOutput> {
  return generateSoundtrackFlow(input);
}

const generateSoundtrackPrompt = ai.definePrompt({
  name: 'generateSoundtrackPrompt',
  input: {schema: GenerateSoundtrackInputSchema},
  output: {schema: GenerateSoundtrackOutputSchema},
  prompt: `You are an AI sound design conceptualizer. Your task is to describe a concept for a 1-3 minute royalty-free background soundtrack based on the user-selected genre and mood. Provide a detailed description of what this soundtrack would sound like and include specific metadata such as BPM, key, primary instruments, and mood tags. As a text-based AI, you cannot generate actual audio files. Your response should focus on providing a rich textual description and precise metadata.

Genre: {{{genre}}}
Mood: {{{mood}}}
Length: {{{lengthMinutes}}} minutes`,
});

const generateSoundtrackFlow = ai.defineFlow(
  {
    name: 'generateSoundtrackFlow',
    inputSchema: GenerateSoundtrackInputSchema,
    outputSchema: GenerateSoundtrackOutputSchema,
  },
  async input => {
    const {output} = await generateSoundtrackPrompt(input);
    return output!;
  }
);
