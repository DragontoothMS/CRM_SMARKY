import type { Channel } from './channel';

export type MessageDirection = 'inbound' | 'outbound';

export type SenderType = 'contact' | 'ai' | 'human' | 'system';

export type MessageContentType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sticker'
  | 'template'
  | 'system';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * No lleva workspaceId: cuelga de Conversation, que sí lo tiene. Cuando exista
 * RLS, la política se resuelve por el join a conversations.
 */
export interface Message {
  id: string;
  conversationId: string;
  channel: Channel;
  externalMessageId?: string;
  direction: MessageDirection;
  senderType: SenderType;
  contentType: MessageContentType;
  text?: string;
  mediaUrl?: string;
  fileName?: string;
  status?: MessageStatus;
  createdAt: string;
}
