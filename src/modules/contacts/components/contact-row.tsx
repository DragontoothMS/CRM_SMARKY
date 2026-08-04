'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeShort } from '@/lib/format';
import { CHANNEL_META } from '@/lib/channels';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { StageBadge } from '@/components/common/stage-badge';
import { TagBadgeList } from '@/components/common/tag-badge-list';
import type { PipelineStage, Tag } from '@/types';
import { resolveListAiState, type ContactSummary } from '../utils/contact-summary';

interface ContactRowProps {
  summary: ContactSummary;
  tags: Tag[];
  stage?: PipelineStage;
  isSelected: boolean;
  now: string;
  onSelect: () => void;
}

/**
 * A diferencia de la fila del Inbox, acá no va el último mensaje: Contactos
 * prioriza identidad y estado comercial, no el hilo de la conversación.
 */
export function ContactRow({ summary, tags, stage, isSelected, now, onSelect }: ContactRowProps) {
  const { contact, primaryChannel, identity, lastInteractionAt } = summary;
  const aiState = resolveListAiState(summary);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(
        'relative flex w-full items-center gap-3 px-4 py-2 text-left transition-colors',
        'after:absolute after:inset-x-0 after:bottom-0 after:ml-[60px] after:h-px after:bg-border',
        isSelected ? 'bg-secondary' : 'hover:bg-secondary/60',
      )}
    >
      {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-primary" aria-hidden />}

      <ChannelAvatar name={contact.name} channel={primaryChannel} size={44} />

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px]/tight font-medium text-foreground">
            {contact.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {lastInteractionAt ? formatRelativeShort(lastInteractionAt, now) : 'Sin actividad'}
          </span>
        </div>

        {/* En Messenger el identificador es el propio nombre: repetirlo no aporta. */}
        <p className="truncate text-sm/tight text-muted-foreground">
          {identity === contact.name ? CHANNEL_META[primaryChannel].label : identity}
        </p>

        <div className="flex items-center gap-1.5">
          {stage && <StageBadge stage={stage} />}
          <TagBadgeList tags={tags} max={2} />
          {/* Solo con una conversación: con varias el estado sería ambiguo. */}
          {aiState && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary"
              title="Respuesta con IA activa"
            >
              <Sparkles className="size-2.5" />
              IA
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
