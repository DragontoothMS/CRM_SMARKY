'use client';

import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTimeLong } from '@/lib/format';
import { CURRENT_USER } from '@/mocks';
import type { InternalNote } from '@/types';
import { useInbox } from '../../hooks/use-inbox';
import { PanelSection } from './panel-section';

/** Notas internas del equipo. Nunca se envían al contacto ni aparecen en el chat. */
export function ContactNotesSection({
  conversationId,
  notes,
}: {
  conversationId: string;
  notes: InternalNote[];
}) {
  const { dispatch } = useInbox();
  const [body, setBody] = useState('');

  function handleAdd() {
    const trimmed = body.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_NOTE',
      conversationId,
      body: trimmed,
      noteId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setBody('');
  }

  return (
    <PanelSection title="Notas internas" icon={StickyNote}>
      <div className="space-y-3">
        <div className="space-y-2">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Agregar una nota para el equipo..."
            rows={2}
            className="resize-none bg-surface text-sm"
          />
          {/* El botón aparece recién al escribir: deshabilitado solo ocupaba espacio. */}
          {body.trim().length > 0 && (
            <Button size="sm" className="h-9 w-full" onClick={handleAdd}>
              Guardar nota
            </Button>
          )}
        </div>

        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground">Todavía no hay notas.</p>
        ) : (
          <ul className="space-y-2.5">
            {notes.map((note) => (
              <li key={note.id} className="rounded-lg border border-border bg-secondary/50 p-2.5">
                <p className="text-sm whitespace-pre-wrap text-foreground">{note.body}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {CURRENT_USER.name} · {formatDateTimeLong(note.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PanelSection>
  );
}
