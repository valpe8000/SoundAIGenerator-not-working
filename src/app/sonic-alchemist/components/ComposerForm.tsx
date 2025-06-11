'use client';

import type { GenerateSoundtrackInput, GenerateSoundtrackOutput } from '@/ai/flows/generate-soundtrack';
import { zodResolver } from '@hookform/resolvers/zod';
import { Music2, Headphones, CloudDrizzle, Zap, Drum, Skull, Castle, PartyPopper, Leaf, Sunrise, Wand2, SlidersHorizontal, FileAudio, Info, Loader2, AlertTriangle } from 'lucide-react';
import { useState, type ReactNode, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { generateSoundtrack } from '@/ai/flows/generate-soundtrack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";

const genres = [
  { value: 'Cinematic', label: 'Cinematic', icon: <Music2 className="w-4 h-4 mr-2" /> },
  { value: 'Lo-fi Hip Hop', label: 'Lo-fi Hip Hop', icon: <Headphones className="w-4 h-4 mr-2" /> },
  { value: 'Ambient', label: 'Ambient', icon: <CloudDrizzle className="w-4 h-4 mr-2" /> },
  { value: 'Electronic', label: 'Electronic', icon: <Zap className="w-4 h-4 mr-2" /> },
  { value: 'Jazz', label: 'Jazz', icon: <Drum className="w-4 h-4 mr-2" /> },
  { value: 'Horror', label: 'Horror', icon: <Skull className="w-4 h-4 mr-2" /> },
  { value: 'Fantasy', label: 'Fantasy', icon: <Castle className="w-4 h-4 mr-2" /> },
  { value: 'Pop', label: 'Pop', icon: <PartyPopper className="w-4 h-4 mr-2" /> },
  { value: 'Indie Folk', label: 'Indie Folk', icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: 'Synthwave', label: 'Synthwave', icon: <Sunrise className="w-4 h-4 mr-2" /> },
];

const moods = [
  { value: 'Relaxing', label: 'Relaxing' },
  { value: 'Epic', label: 'Epic' },
  { value: 'Intense', label: 'Intense' },
  { value: 'Happy', label: 'Happy' },
  { value: 'Upbeat', label: 'Upbeat' },
  { value: 'Dark', label: 'Dark' },
  { value: 'Mysterious', label: 'Mysterious' },
  { value: 'Calm', label: 'Calm' },
  { value: 'Energetic', label: 'Energetic' },
];

const formSchema = z.object({
  genre: z.string().min(1, 'Please select a genre.'),
  mood: z.string().min(1, 'Please select a mood.'),
  lengthMinutes: z.number().min(1).max(3).default(1),
  loop: z.boolean().default(false),
  moodIntensity: z.number().min(0).max(100).default(50),
});

type ComposerFormValues = z.infer<typeof formSchema>;

interface SoundtrackDisplayProps {
  result: GenerateSoundtrackOutput | null;
  loop: boolean;
}

function SoundtrackDisplay({ result, loop }: SoundtrackDisplayProps) {
  if (!result) return null;

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center"><FileAudio className="mr-2 h-6 w-6 text-accent" /> Generated Soundtrack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-muted-foreground flex items-center mb-1">
            <Info className="mr-2 h-4 w-4"/>
            Track Description & Metadata
          </Label>
          <p id="description" className="text-sm p-3 bg-muted/50 rounded-md whitespace-pre-wrap">{result.description}</p>
        </div>
        {result.audioDataUri ? (
          <div>
            <Label htmlFor="audio-player" className="text-sm font-medium text-muted-foreground mb-1">Audio Preview</Label>
            <audio id="audio-player" controls src={result.audioDataUri} loop={loop} className="w-full rounded-md">
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <FileAudio className="mx-auto h-12 w-12 mb-2" />
            <p>Audio preview not available for this generation.</p>
            <p className="text-xs">(The AI might sometimes only provide metadata)</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" disabled={!result.audioDataUri} onClick={() => alert('MP3 export functionality not implemented yet.')}>Export MP3</Button>
        <Button variant="outline" disabled={!result.audioDataUri} onClick={() => alert('WAV export functionality not implemented yet.')}>Export WAV</Button>
      </CardFooter>
    </Card>
  );
}


export function ComposerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateSoundtrackOutput | null>(null);
  const [currentLoop, setCurrentLoop] = useState(false);
  const { toast } = useToast();

  const form = useForm<ComposerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: 'Cinematic',
      mood: 'Epic',
      lengthMinutes: 1,
      loop: false,
      moodIntensity: 50,
    },
  });

  const onSubmit = async (values: ComposerFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentLoop(values.loop);

    try {
      const input: GenerateSoundtrackInput = {
        genre: values.genre,
        mood: values.mood,
        lengthMinutes: values.lengthMinutes,
      };
      // Note: values.moodIntensity is not used by the current AI flow `generateSoundtrack`
      // It's included in the form as per UI requirements for potential future enhancements.
      const aiResult = await generateSoundtrack(input);
      setResult(aiResult);
      toast({
        title: "Soundtrack Generated!",
        description: "Your custom track is ready for preview.",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate soundtrack: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const lengthMinutes = form.watch('lengthMinutes');
  const moodIntensity = form.watch('moodIntensity');


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center"><Wand2 className="mr-2 h-6 w-6 text-accent"/>Create Your Soundtrack</CardTitle>
          <CardDescription>Select your preferences and let the AI compose a unique track.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre.value} value={genre.value}>
                            <span className="flex items-center">{genre.icon} {genre.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lengthMinutes"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Track Length</FormLabel>
                      <span className="text-sm text-muted-foreground">{lengthMinutes} minute{lengthMinutes > 1 ? 's' : ''}</span>
                    </div>
                    <FormControl>
                       <Slider
                        min={1}
                        max={3}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>Adjustable from 1 to 3 minutes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loop"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                    <div className="space-y-0.5">
                      <FormLabel>Loop Track</FormLabel>
                      <FormDescription>
                        Enable to loop the soundtrack during preview.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="moodIntensity"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex justify-between items-center">
                      <FormLabel>Mood Intensity</FormLabel>
                       <span className="text-sm text-muted-foreground">{moodIntensity}%</span>
                    </div>
                    <FormControl>
                       <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>Adjust the intensity of the mood. (Note: This setting is for future use and does not currently affect AI generation.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SlidersHorizontal className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating...' : 'Generate Soundtrack'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-accent/50 rounded-lg h-64 bg-card animate-pulse">
            <Loader2 className="h-16 w-16 text-accent animate-spin mb-4" />
            <p className="text-lg font-semibold text-accent">Crafting your masterpiece...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-destructive/50 rounded-lg h-64 bg-card">
             <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <p className="text-lg font-semibold text-destructive">Oops! Something went wrong.</p>
            <p className="text-sm text-destructive-foreground/80">{error}</p>
          </div>
        )}
        {!isLoading && !error && result && <SoundtrackDisplay result={result} loop={currentLoop} />}
        {!isLoading && !error && !result && (
           <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-lg h-64 bg-card">
            <Music2 className="h-16 w-16 text-primary/50 mb-4" />
            <p className="text-lg font-semibold text-primary/80">Ready to Compose?</p>
            <p className="text-sm text-muted-foreground">Your generated soundtrack will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
