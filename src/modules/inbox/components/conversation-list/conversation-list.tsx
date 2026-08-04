'use client';

import { Inbox } from 'lucide-react';
import { useInbox } from '../../hooks/use-inbox';
import { useVisibleConversations } from '../../hooks/use-visible-conversations';
import { ConversationListHeader } from './conversation-list-header';
import { ConversationRow } from './conversation-row';

export function ConversationList({ onSelect }: { onSelect?: () => void }) {
  const { state, dispatch } = useInbox();
  const rows = useVisibleConversations();

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <ConversationListHeader total={rows.length} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Inbox className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Sin conversaciones</p>
            <p className="text-xs text-muted-foreground">
              Probá con otro canal, etiqueta o término de búsqueda.
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <ConversationRow
              key={row.conversation.id}
              data={row}
              tags={row.contact.tagIds.map((id) => state.tags[id]).filter(Boolean)}
              isSelected={state.selectedConversationId === row.conversation.id}
              now={state.seededAt}
              onSelect={() => {
                dispatch({ type: 'SELECT_CONVERSATION', conversationId: row.conversation.id });
                onSelect?.();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
