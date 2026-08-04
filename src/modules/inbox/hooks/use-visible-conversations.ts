'use client';

import { useMemo } from 'react';
import type { Contact, Conversation, PipelineStage } from '@/types';
import { describeLastMessage } from '../utils/conversation-preview';
import { useInbox } from './use-inbox';

export interface ConversationRowData {
  conversation: Conversation;
  contact: Contact;
  stage?: PipelineStage;
  preview: string;
}

/**
 * Lista derivada, nunca estado duplicado: los cuatro filtros se combinan con AND
 * y el resultado se ordena por lastMessageAt descendente.
 */
export function useVisibleConversations(): ConversationRowData[] {
  const { state } = useInbox();
  const { conversations, contacts, stages, messagesByConversation, filters } = state;

  return useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return Object.values(conversations)
      .map((conversation): Partial<ConversationRowData> & { conversation: Conversation } => {
        const contact = contacts[conversation.contactId];
        const messages = messagesByConversation[conversation.id] ?? [];
        return {
          conversation,
          contact,
          stage: contact ? stages[contact.stageId] : undefined,
          preview: describeLastMessage(messages),
        };
      })
      .filter((row): row is ConversationRowData => Boolean(row.contact))
      .filter(({ conversation, contact, preview }) => {
        if (filters.channel !== 'all' && conversation.channel !== filters.channel) return false;
        if (filters.tagId && !contact.tagIds.includes(filters.tagId)) return false;
        if (filters.stageId && contact.stageId !== filters.stageId) return false;
        if (!search) return true;
        return (
          contact.name.toLowerCase().includes(search) ||
          (contact.username?.toLowerCase().includes(search) ?? false) ||
          (contact.phone?.toLowerCase().includes(search) ?? false) ||
          preview.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => b.conversation.lastMessageAt.localeCompare(a.conversation.lastMessageAt));
  }, [conversations, contacts, stages, messagesByConversation, filters]);
}
