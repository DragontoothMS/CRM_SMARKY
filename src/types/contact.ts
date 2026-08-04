import type { Channel } from './channel';

export interface ChannelIdentity {
  channel: Channel;
  externalId: string;
  displayValue: string;
}

export interface Contact {
  id: string;
  workspaceId: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  username?: string;
  channelIdentities: ChannelIdentity[];
  tagIds: string[];
  stageId: string;
  createdAt: string;
  updatedAt: string;
}
