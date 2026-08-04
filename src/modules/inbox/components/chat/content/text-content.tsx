import { FileBadge } from 'lucide-react';
import type { Message } from '@/types';

/**
 * Texto y plantilla. La plantilla usa render simplificado (etiqueta + texto):
 * el layout rico con variables llega en la próxima iteración.
 */
export function TextContent({ message }: { message: Message }) {
  const isTemplate = message.contentType === 'template';

  return (
    <div className="space-y-1.5">
      {isTemplate && (
        <span className="inline-flex items-center gap-1 rounded border border-current/20 px-1.5 py-0.5 text-[11px] font-medium opacity-70">
          <FileBadge className="size-3" />
          Plantilla
        </span>
      )}
      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
    </div>
  );
}
