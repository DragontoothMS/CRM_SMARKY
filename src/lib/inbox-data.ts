import type { MediaData } from '@kapso/whatsapp-cloud-api';

export type ConversationStatusFilter = 'all' | 'active' | 'ended';

export type Conversation = {
  id: string;
  phoneNumber: string;
  status: string;
  lastActiveAt?: string;
  phoneNumberId: string;
  inboxPhoneNumber?: string;
  inboxDisplayName?: string;
  businessAccountId?: string;
  metadata?: Record<string, unknown>;
  contactName?: string;
  messagesCount?: number;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    direction: string;
    type?: string;
  };
};

export type Message = {
  id: string;
  conversationId: string;
  phoneNumberId: string;
  direction: 'inbound' | 'outbound';
  content: string;
  createdAt: string;
  status?: string;
  phoneNumber: string;
  hasMedia: boolean;
  mediaData?: {
    url: string;
    contentType?: string;
    filename?: string;
  } | (MediaData & { url: string });
  reactionEmoji?: string | null;
  reactedToMessageId?: string | null;
  contextMessageId?: string | null;
  repliedTo?: {
    id: string;
    conversationId: string;
    content: string;
    direction: 'inbound' | 'outbound';
    messageType?: string;
    senderName?: string;
  } | null;
  filename?: string | null;
  mimeType?: string | null;
  messageType?: string;
  caption?: string | null;
  metadata?: {
    mediaId?: string;
    caption?: string;
  };
};

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const;

export function conversationMessagesQueryKey(phoneNumberId: string | undefined, conversationId: string) {
  return ['conversation-messages', phoneNumberId ?? '', conversationId] as const;
}

export function phoneThreadMessagesQueryKey(
  phoneNumberId: string | undefined,
  phoneNumber: string | undefined,
  conversationIds: string[]
) {
  return ['phone-thread-messages', phoneNumberId ?? '', phoneNumber ?? '', conversationIds.join(':')] as const;
}

export async function fetchConversations(): Promise<Conversation[]> {
  // WhatsApp cierra conversaciones rápidamente (status='ended'), así que
  // primero intentamos con status=active. Si trae vacío, reintentamos sin filtro
  // para que el CRM vea conversaciones reales.
  const tryStatuses = ['active', 'all'] as const;

  for (const status of tryStatuses) {
    const url = status === 'all'
      ? '/api/conversations?limit=100'
      : `/api/conversations?status=${status}&limit=100`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch conversations');
    }

    const convs = data.data || [];
    if (convs.length > 0) {
      return convs;
    }
  }

  return [];
}

export async function fetchConversationMessages(conversationId: string, phoneNumberId?: string): Promise<Message[]> {
  const params = new URLSearchParams({ limit: '100' });
  if (phoneNumberId) {
    params.set('phoneNumberId', phoneNumberId);
  }

  const response = await fetch(`/api/messages/${conversationId}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch messages');
  }

  const messages = (data.data || []).map((message: Omit<Message, 'conversationId'>) => ({
    ...message,
    phoneNumberId: message.phoneNumberId ?? phoneNumberId ?? '',
    conversationId,
  }));

  return normalizeMessages(messages);
}

export function normalizeMessages(messages: Message[]): Message[] {
  const reactions = messages.filter(message => message.messageType === 'reaction');
  const regularMessages = messages.filter(message => message.messageType !== 'reaction');
  const reactionMap = new Map<string, string>();
  const messageMap = new Map(regularMessages.map(message => [message.id, message]));

  reactions.forEach((reaction) => {
    if (reaction.reactedToMessageId && reaction.reactionEmoji) {
      reactionMap.set(reaction.reactedToMessageId, reaction.reactionEmoji);
    }
  });

  return regularMessages
    .map((message) => {
      const reaction = reactionMap.get(message.id);
      const contextMessageId = message.contextMessageId?.trim();
      const repliedMessage = contextMessageId ? messageMap.get(contextMessageId) : undefined;
      const repliedTo = message.repliedTo ?? (
        repliedMessage
          ? {
              id: repliedMessage.id,
              conversationId: repliedMessage.conversationId,
              content: getReplyPreviewContent(repliedMessage),
              direction: repliedMessage.direction,
              messageType: repliedMessage.messageType,
              senderName: repliedMessage.direction === 'outbound' ? 'You' : 'Contact',
            }
          : contextMessageId
            ? {
                id: contextMessageId,
                conversationId: message.conversationId,
                content: 'Original message',
                direction: 'inbound' as const,
                senderName: 'Contact',
              }
            : undefined
      );

      return {
        ...message,
        ...(reaction ? { reactionEmoji: reaction } : {}),
        ...(repliedTo ? { repliedTo } : {}),
      };
    })
    .sort((a, b) => parseTimestamp(a.createdAt) - parseTimestamp(b.createdAt));
}

function parseTimestamp(timestamp?: string): number {
  if (!timestamp) return 0;
  const time = Date.parse(timestamp);
  return Number.isFinite(time) ? time : 0;
}

function getReplyPreviewContent(message: Message): string {
  const content = message.caption || message.content || message.filename || '';
  const trimmedContent = content.trim();

  if (trimmedContent) {
    return trimmedContent.length > 120 ? `${trimmedContent.slice(0, 117)}...` : trimmedContent;
  }

  if (message.hasMedia && message.messageType) {
    return `${message.messageType.charAt(0).toUpperCase()}${message.messageType.slice(1)} message`;
  }

  return 'Message';
}
