export type Channel = 'whatsapp' | 'instagram' | 'messenger';

export const CHANNELS: readonly Channel[] = ['whatsapp', 'instagram', 'messenger'];

export interface ChannelAccount {
  id: string;
  workspaceId: string;
  channel: Channel;
  name: string;
  externalAccountId?: string;
  status: 'connected' | 'disconnected' | 'pending';
}
