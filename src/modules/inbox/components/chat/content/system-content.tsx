import { Info } from 'lucide-react';
import type { Message } from '@/types';

/** Aviso de sistema: centrado y sin burbuja, no es un mensaje del contacto. */
export function SystemContent({ message }: { message: Message }) {
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
        <Info className="size-3" />
        {message.text}
      </span>
    </div>
  );
}
