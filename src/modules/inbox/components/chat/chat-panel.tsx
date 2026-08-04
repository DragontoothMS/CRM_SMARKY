'use client';

import { MessagesSquare } from 'lucide-react';
import { useInbox, useSelectedConversation } from '../../hooks/use-inbox';
import { useSessionWindow } from '../../hooks/use-session-window';
import { ChatHeader } from './chat-header';
import { Composer } from './composer';
import { MessageList } from './message-list';

interface ChatPanelProps {
  detailsOpen: boolean;
  onToggleDetails: () => void;
  onBack: () => void;
}

export function ChatPanel({ detailsOpen, onToggleDetails, onBack }: ChatPanelProps) {
  const { state } = useInbox();
  const selected = useSelectedConversation();
  const sessionWindow = useSessionWindow(selected?.conversation ?? null, selected?.messages ?? []);

  if (!selected) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-background px-6 text-center">
        <MessagesSquare className="size-9 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Ninguna conversación seleccionada</p>
        <p className="text-xs text-muted-foreground">Elegí una de la lista para verla acá.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader
        conversation={selected.conversation}
        contact={selected.contact}
        stage={selected.stage}
        detailsOpen={detailsOpen}
        onToggleDetails={onToggleDetails}
        onBack={onBack}
      />
      <MessageList messages={selected.messages} now={state.seededAt} />
      <Composer conversationId={selected.conversation.id} sessionWindow={sessionWindow} />
    </div>
  );
}
