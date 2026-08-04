'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  KanbanSquare,
  MessagesSquare,
  Sparkles,
  StickyNote,
  Tags,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { ChannelBadge } from '@/components/common/channel-badge';
import { StageBadge } from '@/components/common/stage-badge';
import { TagBadge } from '@/components/common/tag-badge-list';
import { formatDateTimeLong } from '@/lib/format';
import { PanelSection } from '@/modules/inbox/components/contact-panel/panel-section';
import { CURRENT_USER } from '@/mocks';
import type { InternalNote, PipelineStage, Tag } from '@/types';
import { describeInactivity, type PipelineCard } from '../utils/pipeline-cards';
import { MoveStageMenu } from './move-stage-menu';

interface OpportunityDetailProps {
  card: PipelineCard;
  tags: Tag[];
  stage?: PipelineStage;
  stages: PipelineStage[];
  notes: InternalNote[];
  onMove: (stageId: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

/**
 * Solo lectura salvo la etapa: contacto, etiquetas, IA y notas se editan en el
 * Inbox, que es donde ese trabajo tiene contexto.
 */
export function OpportunityDetail({
  card,
  tags,
  stage,
  stages,
  notes,
  onMove,
  onBack,
  onClose,
}: OpportunityDetailProps) {
  const { contact, conversation, channel, aiEnabled, inactivity, hoursInactive } = card;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" className="size-9 shrink-0" onClick={onBack}>
              <ArrowLeft className="size-[18px]" />
              <span className="sr-only">Volver al tablero</span>
            </Button>
          )}
          <h2 className="truncate text-sm font-semibold text-foreground">Detalle de oportunidad</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onClose}>
            <X className="size-4" />
            <span className="sr-only">Cerrar detalle</span>
          </Button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-5">
          <ChannelAvatar name={contact.name} channel={channel} size={64} />
          <p className="text-[15px] font-semibold text-foreground">{contact.name}</p>
          <ChannelBadge channel={channel} />
          <Button
            size="sm"
            className="mt-1 h-9 w-full"
            nativeButton={false}
            render={<Link href={`/inbox?c=${conversation.id}`} />}
          >
            <MessagesSquare className="size-4" />
            Ver conversación
          </Button>
        </div>

        <PanelSection title="Etapa" icon={KanbanSquare}>
          <div className="space-y-2.5">
            {stage && <StageBadge stage={stage} />}
            {/* Única edición permitida en Pipeline. */}
            <MoveStageMenu
              stages={stages}
              currentStageId={card.stageId}
              onMove={onMove}
              className="w-full justify-center"
            />
          </div>
        </PanelSection>

        <PanelSection title="Actividad" icon={Clock}>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Última interacción</p>
              <p className="text-sm text-foreground">
                {formatDateTimeLong(card.lastMessageAt)}
              </p>
            </div>
            {inactivity !== 'none' && (
              <p
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium',
                  inactivity === 'stale' ? 'text-destructive' : 'text-warning',
                )}
              >
                <AlertTriangle className="size-3.5" />
                {describeInactivity(hoursInactive)}
              </p>
            )}
            <p
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
                aiEnabled ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground',
              )}
            >
              <Sparkles className="size-2.5" />
              {aiEnabled ? 'IA activa' : 'IA desactivada'}
            </p>
          </div>
        </PanelSection>

        <PanelSection title="Etiquetas" icon={Tags}>
          {tags.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sin etiquetas asignadas.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </PanelSection>

        <PanelSection title="Notas internas" icon={StickyNote}>
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
        </PanelSection>
      </div>
    </div>
  );
}
