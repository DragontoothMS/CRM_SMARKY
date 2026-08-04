'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { ChannelBadge } from '@/components/common/channel-badge';
import { useSelectedConversation } from '../../hooks/use-inbox';
import { AIControlSection } from './ai-control-section';
import { ContactInfoSection } from './contact-info-section';
import { ContactNotesSection } from './contact-notes-section';
import { ContactStageSection } from './contact-stage-section';
import { ContactTagsSection } from './contact-tags-section';

export function ContactPanel({ onClose }: { onClose: () => void }) {
  const selected = useSelectedConversation();
  if (!selected) return null;

  const { contact, conversation, notes } = selected;
  const identity = contact.channelIdentities.find((i) => i.channel === conversation.channel);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <h2 className="text-sm font-semibold text-foreground">Detalles del contacto</h2>
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Cerrar detalles</span>
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Identidad completa en un solo bloque: nombre, teléfono/usuario y canal. */}
        <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-5">
          <ChannelAvatar name={contact.name} channel={conversation.channel} size={64} />
          <div className="space-y-1 text-center">
            <p className="text-[15px] font-semibold text-foreground">{contact.name}</p>
            {identity && <p className="text-xs text-muted-foreground">{identity.displayValue}</p>}
          </div>
          <ChannelBadge channel={conversation.channel} />
        </div>

        <ContactInfoSection contact={contact} conversation={conversation} />
        <ContactTagsSection contact={contact} />
        <ContactStageSection contact={contact} />
        <ContactNotesSection conversationId={conversation.id} notes={notes} />
        <AIControlSection conversation={conversation} />
      </div>
    </div>
  );
}
