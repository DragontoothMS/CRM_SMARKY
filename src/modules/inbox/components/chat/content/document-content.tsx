import { FileText } from 'lucide-react';
import type { Message } from '@/types';

/** Tarjeta de documento. Único contenido que muestra el nombre de archivo. */
export function DocumentContent({ message }: { message: Message }) {
  return (
    <div className="space-y-1.5">
      <a
        href={message.mediaUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full max-w-xs items-center gap-3 rounded-lg border border-current/15 bg-current/5 p-2.5 transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-current/10">
          <FileText className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{message.fileName}</span>
          <span className="block text-xs opacity-70">Documento</span>
        </span>
      </a>
      {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
    </div>
  );
}
