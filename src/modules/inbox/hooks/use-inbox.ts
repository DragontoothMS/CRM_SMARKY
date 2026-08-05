'use client';

import { useContext } from 'react';
import { InboxContext, type InboxContextValue } from '../state/inbox-context';

export function useInbox(): InboxContextValue {
  const context = useContext(InboxContext);
  if (!context) throw new Error('useInbox debe usarse dentro de <InboxProvider>');
  return context;
}

/** Conversación abierta con su contacto y etapa ya resueltos. */
export function useSelectedConversation() {
  const { state } = useInbox();
  const conversation = state.selectedConversationId
    ? state.conversations[state.selectedConversationId]
    : null;
  if (!conversation) return null;
  const contact = state.contacts[conversation.contactId];
  if (!contact) return null;
  return {
    conversation,
    contact,
    stage: state.stages[contact.stageId],
    channelAccount: state.channelAccounts[conversation.channelAccountId],
    messages: state.messagesByConversation[conversation.id] ?? [],
    notes: state.notesByConversation[conversation.id] ?? [],
  };
}
