import { SiteHeader } from '@/components/SiteHeader';
import { ComposerForm } from '@/app/sonic-alchemist/components/ComposerForm';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ComposerForm />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} SonicAlchemist. Powered by AI.
      </footer>
    </div>
  );
}
