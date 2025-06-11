import { Music } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="py-8 px-4 md:px-8 text-center bg-gradient-to-b from-primary/30 to-transparent">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <Music className="w-12 h-12 text-accent mr-3" />
          <h1 className="text-5xl font-headline font-bold tracking-tight">
            Sonic<span className="text-accent">Alchemist</span>
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
          Welcome to SonicAlchemist — your AI-powered soundtrack generator. Choose a genre, set the mood, and let us create a custom soundtrack for your project in seconds.
        </p>
      </div>
    </header>
  );
}
