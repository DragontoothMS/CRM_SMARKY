'use client';

import { ArrowLeft, Bot, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { StageBadge } from '@/components/common/stage-badge';
import type { Contact, Conversation, PipelineStage } from '@/types';

interface ChatHeaderProps {
  conversation: Conversation;
  contact: Contact;
  stage?: PipelineStage;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  onBack: () => void;
}

export function ChatHeader({
  conversation,
  contact,
  stage,
  detailsOpen,
  onToggleDetails,
  onBack,
}: ChatHeaderProps) {
  const identity = contact.channelIdentities.find((i) => i.channel === conversation.channel);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      {/* En móvil el chat ocupa toda la vista: hace falta volver a la lista. */}
      <Button variant="ghost" size="icon" className="size-9 shrink-0 lg:hidden" onClick={onBack}>
        <ArrowLeft className="size-[18px]" />
        <span className="sr-only">Volver a conversaciones</span>
      </Button>

      <ChannelAvatar name={contact.name} channel={conversation.channel} size={40} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[15px] font-semibold text-foreground">{contact.name}</h2>
          {conversation.aiEnabled && (
            <span className="hidden items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary sm:inline-flex">
              <Bot className="size-3" />
              IA activa
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{identity?.displayValue}</p>
      </div>

      {/* Sin badge de canal: ya lo lleva el avatar, a 40px de acá. */}
      <div className="hidden items-center gap-2 md:flex">
        {stage && <StageBadge stage={stage} />}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0"
        onClick={onToggleDetails}
        aria-label={detailsOpen ? 'Ocultar detalles' : 'Ver detalles del contacto'}
      >
        {detailsOpen ? (
          <PanelRightClose className="size-[18px]" />
        ) : (
          <PanelRightOpen className="size-[18px]" />
        )}
      </Button>
    </header>
  );
}
