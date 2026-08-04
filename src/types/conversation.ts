import type { Channel } from './channel';

export type ConversationStatus = 'open' | 'closed' | 'archived';

export interface Conversation {
  id: string;
  workspaceId: string;
  contactId: string;
  channelAccountId: string;
  channel: Channel;
  externalConversationId?: string;
  status: ConversationStatus;
  aiEnabled: boolean;
  unreadCount: number;
  lastMessageId?: string;
  lastMessageAt: string;
  createdAt: string;
}
