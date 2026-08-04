import type { Channel, Contact, Conversation } from '@/types';

export interface ContactConversationSummary {
  conversation: Conversation;
  /** La IA pertenece a la conversación, nunca al contacto. */
  aiEnabled: boolean;
}

export interface ContactSummary {
  contact: Contact;
  /** Canal de la conversación más reciente; si no hay, el de su primera identidad. */
  primaryChannel: Channel;
  /** Teléfono o usuario del canal principal. */
  identity: string;
  /** ISO de la última interacción, o null si el contacto nunca conversó. */
  lastInteractionAt: string | null;
  conversations: ContactConversationSummary[];
}

/**
 * Resume un contacto a partir de sus conversaciones.
 *
 * Todo se deriva: no hay campos nuevos en Contact ni en los mocks.
 */
export function buildContactSummary(
  contact: Contact,
  allConversations: Conversation[],
): ContactSummary {
  const conversations = allConversations
    .filter((conversation) => conversation.contactId === contact.id)
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));

  const primaryChannel =
    conversations[0]?.channel ?? contact.channelIdentities[0]?.channel ?? 'whatsapp';

  const identity =
    contact.channelIdentities.find((i) => i.channel === primaryChannel)?.displayValue ??
    contact.phone ??
    contact.username ??
    '—';

  return {
    contact,
    primaryChannel,
    identity,
    lastInteractionAt: conversations[0]?.lastMessageAt ?? null,
    conversations: conversations.map((conversation) => ({
      conversation,
      aiEnabled: conversation.aiEnabled,
    })),
  };
}

/**
 * Estado de IA para el listado. Solo tiene sentido mostrarlo cuando hay una
 * única conversación: con varias sería ambiguo, y ahí se muestra por conversación.
 */
export function resolveListAiState(summary: ContactSummary): boolean | null {
  if (summary.conversations.length !== 1) return null;
  return summary.conversations[0].aiEnabled;
}
