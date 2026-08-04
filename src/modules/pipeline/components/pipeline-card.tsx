'use client';

import { AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeShort, truncate } from '@/lib/format';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { TagBadgeList } from '@/components/common/tag-badge-list';
import type { PipelineStage, Tag } from '@/types';
import { describeInactivity, type PipelineCard as Card } from '../utils/pipeline-cards';
import { MoveStageMenu } from './move-stage-menu';

interface PipelineCardProps {
  card: Card;
  tags: Tag[];
  stages: PipelineStage[];
  isSelected: boolean;
  isDragging: boolean;
  /** Solo escritorio: en táctil no hay eventos de drag. */
  canDrag: boolean;
  now: string;
  onSelect: () => void;
  onMove: (stageId: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function PipelineCard({
  card,
  tags,
  stages,
  isSelected,
  isDragging,
  canDrag,
  now,
  onSelect,
  onMove,
  onDragStart,
  onDragEnd,
}: PipelineCardProps) {
  const { contact, channel, preview, lastMessageAt, aiEnabled, inactivity, hoursInactive } = card;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={isSelected ? 'true' : undefined}
      draggable={canDrag}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'group space-y-2 rounded-xl border bg-surface p-3 text-left transition-all',
        canDrag && 'cursor-grab active:cursor-grabbing',
        isSelected ? 'border-primary shadow-sm' : 'border-border hover:border-primary/40',
        // Al arrastrar la tarjeta sigue bien visible: solo una pista leve
        // (borde teal + sombra + escala mínima), no un fantasma semitransparente.
        isDragging && 'scale-[0.98] border-primary opacity-90 shadow-md',
      )}
    >
      <div className="flex items-start gap-2.5">
        <ChannelAvatar name={contact.name} channel={channel} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm/tight font-medium text-foreground">
              {contact.name}
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatRelativeShort(lastMessageAt, now)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs/tight text-muted-foreground">
            {truncate(preview, 48)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <TagBadgeList tags={tags} max={2} />
        {aiEnabled && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary"
            title="Respuesta con IA activa"
          >
            <Sparkles className="size-2.5" />
            IA
          </span>
        )}
      </div>

      {/* Solo cuando hay algo que mirar: una tarjeta activa no lleva alerta. */}
      {inactivity !== 'none' && (
        <p
          className={cn(
            'flex items-center gap-1 text-[11px] font-medium',
            inactivity === 'stale' ? 'text-destructive' : 'text-warning',
          )}
        >
          <AlertTriangle className="size-3" />
          {describeInactivity(hoursInactive)}
        </p>
      )}

      {/*
        Siempre disponible, no solo en táctil: el arrastre nativo no scrollea el
        tablero, así que una columna fuera de vista es inalcanzable arrastrando.
        En escritorio aparece al pasar el mouse para no ensuciar la tarjeta.
      */}
      <MoveStageMenu
        stages={stages}
        currentStageId={card.stageId}
        onMove={onMove}
        className={cn(
          'w-full justify-center',
          canDrag && 'opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100',
        )}
      />
    </div>
  );
}
