'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { PipelineStage, Tag } from '@/types';
import type { PipelineCard as Card } from '../utils/pipeline-cards';
import { PipelineCard } from './pipeline-card';

const STAGE_DOT: Record<string, string> = {
  slate: 'bg-slate-500',
  blue: 'bg-sky-600',
  amber: 'bg-amber-500',
  teal: 'bg-teal-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
};

interface PipelineColumnProps {
  stage: PipelineStage;
  cards: Card[];
  stages: PipelineStage[];
  tagsById: Record<string, Tag>;
  selectedId: string | null;
  draggingId: string | null;
  canDrag: boolean;
  now: string;
  /** Ocupa todo el ancho en móvil, donde se ve una columna por vez. */
  fullWidth?: boolean;
  onSelect: (cardId: string) => void;
  onMove: (cardId: string, stageId: string) => void;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
}

export function PipelineColumn({
  stage,
  cards,
  stages,
  tagsById,
  selectedId,
  draggingId,
  canDrag,
  now,
  fullWidth,
  onSelect,
  onMove,
  onDragStart,
  onDragEnd,
}: PipelineColumnProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      aria-label={stage.name}
      // Contenedor propio: fondo suave + borde neutro para que cada etapa se lea
      // como una columna. El ring del drop va acá dentro (ring, no border) para
      // no empujar el layout ni cambiar el tamaño de la columna.
      className={cn(
        'flex min-h-0 flex-col rounded-xl border border-border bg-muted/40 transition-colors',
        isOver && 'bg-primary/5 ring-2 ring-primary/60 ring-inset',
        fullWidth ? 'w-full' : 'w-[288px] shrink-0',
      )}
      onDragOver={(event) => {
        if (!canDrag) return;
        // Sin preventDefault el navegador no permite soltar.
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        if (!canDrag) return;
        event.preventDefault();
        setIsOver(false);
        const cardId = event.dataTransfer.getData('text/plain');
        if (cardId) onMove(cardId, stage.id);
      }}
    >
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className={cn('size-2 rounded-full', STAGE_DOT[stage.color])} aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">{stage.name}</h2>
        <span className="rounded-full bg-surface px-1.5 text-xs font-medium text-muted-foreground">
          {cards.length}
        </span>
      </header>

      <div
        className={cn(
          'min-h-0 flex-1 space-y-2 p-2',
          !fullWidth && 'overflow-y-auto',
        )}
      >
        {cards.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            {isOver ? 'Soltá acá' : 'Sin oportunidades'}
          </p>
        ) : (
          cards.map((card) => (
            <PipelineCard
              key={card.id}
              card={card}
              tags={card.contact.tagIds.map((id) => tagsById[id]).filter(Boolean)}
              stages={stages}
              isSelected={selectedId === card.id}
              isDragging={draggingId === card.id}
              canDrag={canDrag}
              now={now}
              onSelect={() => onSelect(card.id)}
              onMove={(stageId) => onMove(card.id, stageId)}
              onDragStart={() => onDragStart(card.id)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
}
