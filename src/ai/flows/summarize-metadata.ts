// SummarizeMetadata.ts
'use server';

/**
 * @fileOverview Summarizes the metadata of a generated soundtrack.
 *
 * - summarizeMetadata - A function that summarizes the metadata of a generated soundtrack.
 * - SummarizeMetadataInput - The input type for the summarizeMetadata function.
 * - SummarizeMetadataOutput - The return type for the summarizeMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMetadataInputSchema = z.object({
  bpm: z.number().describe('The tempo of the track in beats per minute.'),
  key: z.string().describe('The musical key of the track (e.g., C major, A minor).'),
  instruments: z.string().describe('A comma-separated list of instruments used in the track.'),
  mood: z.string().describe('A description of the overall mood or feeling of the track.'),
});
export type SummarizeMetadataInput = z.infer<typeof SummarizeMetadataInputSchema>;

const SummarizeMetadataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the soundtrack metadata.'),
});
export type SummarizeMetadataOutput = z.infer<typeof SummarizeMetadataOutputSchema>;

export async function summarizeMetadata(input: SummarizeMetadataInput): Promise<SummarizeMetadataOutput> {
  return summarizeMetadataFlow(input);
}

const summarizeMetadataPrompt = ai.definePrompt({
  name: 'summarizeMetadataPrompt',
  input: {schema: SummarizeMetadataInputSchema},
  output: {schema: SummarizeMetadataOutputSchema},
  prompt: `Summarize the following metadata of a generated soundtrack in a concise and informative way:\n\nBPM: {{{bpm}}}\nKey: {{{key}}}\nInstruments: {{{instruments}}}\nMood: {{{mood}}}`,
});

const summarizeMetadataFlow = ai.defineFlow(
  {
    name: 'summarizeMetadataFlow',
    inputSchema: SummarizeMetadataInputSchema,
    outputSchema: SummarizeMetadataOutputSchema,
  },
  async input => {
    const {output} = await summarizeMetadataPrompt(input);
    return output!;
  }
);
