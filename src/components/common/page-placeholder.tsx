import { Construction } from 'lucide-react';

/** Placeholder de los módulos que todavía no se construyeron. */
export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
        <Construction className="size-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground">Módulo pendiente para una próxima iteración.</p>
    </div>
  );
}
