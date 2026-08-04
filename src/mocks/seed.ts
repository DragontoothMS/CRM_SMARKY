import type {
  Campaign,
  ChannelAccount,
  Contact,
  Conversation,
  InternalNote,
  Message,
  PipelineStage,
  Tag,
  WhatsAppTemplate,
  Workspace,
} from '@/types';
import { CHANNEL_ACCOUNTS, PIPELINE_STAGES, TAGS, createWorkspace } from './seed-base';
import { createContacts } from './seed-contacts';
import { createConversations } from './seed-conversations';
import { createInternalNotes } from './seed-notes';
import { createWhatsappMessages } from './seed-messages-whatsapp';
import { createInstagramMessages } from './seed-messages-instagram';
import { createMessengerMessages } from './seed-messages-messenger';
import { createTemplates } from './seed-templates';
import { createCampaigns } from './seed-campaigns';

export interface SeedData {
  workspace: Workspace;
  seededAt: string;
  channelAccounts: ChannelAccount[];
  contacts: Contact[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notes: InternalNote[];
  tags: Tag[];
  stages: PipelineStage[];
  templates: WhatsAppTemplate[];
  campaigns: Campaign[];
}

/**
 * Datos demo del workspace. Todo se construye contra `now`, así la demo nunca
 * envejece: la conversación fuera de la ventana de 24 h siempre está a 30 h.
 *
 * Se ejecuta solo en cliente (ver InboxProvider): usar `new Date()` durante el
 * render del servidor produciría HTML distinto al del cliente.
 */
export function createSeedData(now: Date): SeedData {
  return {
    workspace: createWorkspace(now),
    seededAt: now.toISOString(),
    channelAccounts: CHANNEL_ACCOUNTS,
    contacts: createContacts(now),
    conversations: createConversations(now),
    messages: {
      ...createWhatsappMessages(now),
      ...createInstagramMessages(now),
      ...createMessengerMessages(now),
    },
    notes: createInternalNotes(now),
    tags: TAGS,
    stages: PIPELINE_STAGES,
    templates: createTemplates(now),
    campaigns: createCampaigns(now),
  };
}
