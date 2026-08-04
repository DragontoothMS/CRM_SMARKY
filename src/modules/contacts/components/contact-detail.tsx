'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  KanbanSquare,
  MessagesSquare,
  StickyNote,
  Tags,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { ChannelBadge } from '@/components/common/channel-badge';
import { StageBadge } from '@/components/common/stage-badge';
import { TagBadge } from '@/components/common/tag-badge-list';
import { formatDateTimeLong } from '@/lib/format';
import { PanelSection } from '@/modules/inbox/components/contact-panel/panel-section';
import { CURRENT_USER } from '@/mocks';
import type { InternalNote, PipelineStage, Tag } from '@/types';
import type { ContactSummary } from '../utils/contact-summary';
import { ContactConversations } from './contact-conversations';

interface ContactDetailProps {
  summary: ContactSummary;
  tags: Tag[];
  stage?: PipelineStage;
  notes: InternalNote[];
  now: string;
  /** En móvil el detalle ocupa la vista: hace falta volver. */
  onBack?: () => void;
  onClose?: () => void;
}

export function ContactDetail({
  summary,
  tags,
  stage,
  notes,
  now,
  onBack,
  onClose,
}: ContactDetailProps) {
  const { contact, primaryChannel, identity, conversations, lastInteractionAt } = summary;
  const primaryConversation = conversations[0]?.conversation;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" className="size-9 shrink-0" onClick={onBack}>
              <ArrowLeft className="size-[18px]" />
              <span className="sr-only">Volver a contactos</span>
            </Button>
          )}
          <h2 className="truncate text-sm font-semibold text-foreground">Detalle del contacto</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onClose}>
            <X className="size-4" />
            <span className="sr-only">Cerrar detalle</span>
          </Button>
        )}
      </header>

      {/* Ancho acotado: en desktop el detalle ocupa el resto de la pantalla y sin
          esto el botón y las secciones se estiraban más de 1200px. */}
      <div className="mx-auto min-h-0 w-full max-w-xl flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-5">
          <ChannelAvatar name={contact.name} channel={primaryChannel} size={64} />
          <div className="space-y-1 text-center">
            <p className="text-[15px] font-semibold text-foreground">{contact.name}</p>
            {/* En Messenger el identificador es el propio nombre: el badge de canal ya lo dice. */}
            {identity !== contact.name && (
              <p className="text-xs text-muted-foreground">{identity}</p>
            )}
          </div>
          <ChannelBadge channel={primaryChannel} />
          {/* nativeButton={false}: el render es un <a>, no un <button>. */}
          {primaryConversation && (
            <Button
              size="sm"
              className="mt-1 h-9 w-full"
              nativeButton={false}
              render={<Link href={`/inbox?c=${primaryConversation.id}`} />}
            >
              <MessagesSquare className="size-4" />
              Ver conversación
            </Button>
          )}
        </div>

        <PanelSection title="Información" icon={User}>
          <dl className="space-y-2.5">
            <Row icon={CalendarDays} label="Creado" value={formatDateTimeLong(contact.createdAt)} />
            <Row
              icon={Clock}
              label="Última interacción"
              value={lastInteractionAt ? formatDateTimeLong(lastInteractionAt) : 'Sin actividad'}
            />
          </dl>
        </PanelSection>

        <PanelSection title="Etapa" icon={KanbanSquare}>
          {stage ? (
            <StageBadge stage={stage} />
          ) : (
            <p className="text-xs text-muted-foreground">Sin etapa asignada.</p>
          )}
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

        <PanelSection title="Conversaciones" icon={MessagesSquare}>
          <ContactConversations conversations={conversations} stage={stage} now={now} />
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

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}
