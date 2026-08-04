/**
 * Adaptador: datos reales de WhatsApp (Kapso API) → SeedData del CRM.
 *
 * Agrupa conversaciones de Kapso por número de teléfono (múltiples ventanas de
 * 24h) en una sola conversación del CRM con todos los mensajes fusionados,
 * igual que hace el inbox oficial de Kapso.
 */

import {
  TAGS,
  PIPELINE_STAGES,
  WORKSPACE_ID,
} from '@/mocks/seed-base';
import type { MessageContentType } from '@/types/message';
import type { SeedData } from '@/mocks/seed';

type CrmConversationStatus = 'open' | 'closed' | 'archived';

export interface KapsoConversation {
  id: string;
  phoneNumber: string;
  phoneNumberId: string;
  status: string;
  lastActiveAt?: string;
  inboxPhoneNumber?: string;
  inboxDisplayName?: string;
  contactName?: string;
  messagesCount?: number;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    direction: string;
    type?: string;
  };
}

export interface KapsoMessage {
  id: string;
  conversationId: string;
  phoneNumberId: string;
  direction: 'inbound' | 'outbound';
  content: string;
  createdAt: string;
  status?: string;
  phoneNumber: string;
  hasMedia: boolean;
  mediaData?: Record<string, unknown>;
  messageType?: string;
  filename?: string | null;
  caption?: string | null;
  reactionEmoji?: string | null;
}

function contactName(conv: KapsoConversation): string {
  return conv.contactName || conv.inboxDisplayName || conv.phoneNumber;
}

function contactIdFromPhone(phone: string): string {
  return `contact_${phone.replace(/[^0-9]/g, '').slice(-10)}`;
}

/** ID único del CRM para un número de teléfono: agrupa TODAS las conversaciones de Kapso */
function conversationIdFromPhone(phone: string): string {
  return `conv_${phone.replace(/[^0-9]/g, '').slice(-10)}`;
}

function mapContentType(kapsoType?: string): MessageContentType {
  if (!kapsoType || kapsoType === 'text') return 'text';
  if (kapsoType === 'image') return 'image';
  if (kapsoType === 'video') return 'video';
  if (kapsoType === 'audio') return 'audio';
  if (kapsoType === 'document') return 'document';
  if (kapsoType === 'sticker') return 'sticker';
  if (kapsoType === 'reaction') return 'system';
  return 'text';
}

function mapConversationStatus(kapsoStatus: string): CrmConversationStatus {
  if (kapsoStatus === 'active') return 'open';
  if (kapsoStatus === 'ended') return 'closed';
  return 'archived';
}

/** Agrupa conversaciones de Kapso por número. Retorna ordenado por último mensaje. */
function groupByPhoneNumber(convs: KapsoConversation[]): Map<string, KapsoConversation[]> {
  const groups = new Map<string, KapsoConversation[]>();
  for (const conv of convs) {
    const key = conv.phoneNumber.trim();
    const existing = groups.get(key) || [];
    existing.push(conv);
    groups.set(key, existing);
  }
  // Ordenar cada grupo por lastActiveAt descendente
  for (const [key, list] of groups) {
    list.sort((a, b) => (b.lastActiveAt || '').localeCompare(a.lastActiveAt || ''));
  }
  return groups;
}

export function adaptKapsoToSeedData(
  conversations: KapsoConversation[],
  messagesByConversation: Record<string, KapsoMessage[]>,
  now: string,
): SeedData {
  const seededAt = now;
  const workspace = { id: WORKSPACE_ID, name: 'Smarky CRM', slug: 'smarky', createdAt: seededAt };

  const contactsMap = new Map<string, {
    id: string; workspaceId: string; name: string; avatarUrl?: string;
    phone?: string; username?: string;
    channelIdentities: Array<{ channel: 'whatsapp'; externalId: string; displayValue: string }>;
    tagIds: string[]; stageId: string; createdAt: string; updatedAt: string;
  }>();

  const conversationsMap = new Map<string, {
    id: string; workspaceId: string; contactId: string; channelAccountId: string;
    channel: 'whatsapp'; externalConversationId?: string;
    status: CrmConversationStatus; aiEnabled: boolean; unreadCount: number;
    lastMessageId?: string; lastMessageAt: string; createdAt: string;
  }>();

  const messagesResult: Record<string, import('@/types').Message[]> = {};

  // Agrupar por número (igual que el oficial groupConversationsByPhoneNumber)
  const grouped = groupByPhoneNumber(conversations);

  for (const [phone, convs] of grouped) {
    const contactId = contactIdFromPhone(phone);
    const crmConvId = conversationIdFromPhone(phone);
    const latestConv = convs[0]; // el más reciente
    const contactNameStr = contactName(latestConv);

    // Contacto (uno por número)
    if (!contactsMap.has(contactId)) {
      contactsMap.set(contactId, {
        id: contactId,
        workspaceId: WORKSPACE_ID,
        name: contactNameStr,
        phone,
        channelIdentities: [
          { channel: 'whatsapp', externalId: phone.replace(/[^0-9]/g, ''), displayValue: phone },
        ],
        tagIds: [],
        stageId: 'stage_nuevo',
        createdAt: seededAt,
        updatedAt: seededAt,
      });
    }

    // Una sola conversación por número con todos los mensajes fusionados
    const allConvIds = convs.map(c => c.id);
    const allMsgs: KapsoMessage[] = [];

    for (const conv of convs) {
      const msgs = messagesByConversation[conv.id] ?? [];
      allMsgs.push(...msgs);
    }

    // Ordenar mensajes por fecha ascendente
    allMsgs.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    // Estado: si alguna está activa, la conversación está abierta
    const status: CrmConversationStatus = convs.some(c => c.status === 'active') ? 'open' : 'closed';

    // Unread count: sumar de todas
    const unreadCount = convs.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

    // Último mensaje
    const lastMsg = allMsgs.length > 0 ? allMsgs[allMsgs.length - 1] : null;
    const lastMessageAt = lastMsg?.createdAt || latestConv.lastActiveAt || seededAt;

    // External ID: solo la conversación de Kapso más reciente (la primera del grupo)
        let externalConversationId = '';
        if (convs.length > 0) {
          // El grupo ya está ordenado por lastActiveAt descendente
          const latestKapsoId = convs[0].id;
          externalConversationId = latestKapsoId;
        }

        conversationsMap.set(crmConvId, {
          id: crmConvId,
          workspaceId: WORKSPACE_ID,
          contactId,
          channelAccountId: 'acc_wa_01',
          channel: 'whatsapp',
          externalConversationId,
          status,
          aiEnabled: false,
          unreadCount,
          lastMessageId: lastMsg?.id,
          lastMessageAt: allMsgs.length > 0 ? allMsgs[allMsgs.length - 1].createdAt : seededAt,
          createdAt: seededAt,
        });

    // Transformar todos los mensajes
    const maxMessages = 200; // límite para no saturar
    messagesResult[crmConvId] = allMsgs.slice(-maxMessages).map((msg) => ({
      id: msg.id,
      conversationId: crmConvId,
      channel: 'whatsapp' as const,
      externalMessageId: msg.id,
      direction: (msg.direction === 'inbound' ? 'inbound' : 'outbound') as 'inbound' | 'outbound',
      senderType: (msg.direction === 'inbound' ? 'contact' : 'human') as 'contact' | 'human',
      contentType: mapContentType(msg.messageType),
      text: msg.content || msg.caption || undefined,
      mediaUrl: msg.hasMedia ? (msg.mediaData as Record<string, string> | undefined)?.url : undefined,
      fileName: msg.filename ?? undefined,
      status: msg.status && ['pending', 'sent', 'delivered', 'read', 'failed'].includes(msg.status)
        ? (msg.status as import('@/types').MessageStatus)
        : msg.status ? 'sent' as const : undefined,
      createdAt: msg.createdAt,
    } as import('@/types').Message));
  }

  return {
    workspace,
    seededAt,
    channelAccounts: [{
      id: 'acc_wa_01',
      workspaceId: WORKSPACE_ID,
      channel: 'whatsapp' as const,
      name: 'WhatsApp Business',
      externalAccountId: process.env.PHONE_NUMBER_ID || '',
      status: 'connected' as const,
    }],
    contacts: Array.from(contactsMap.values()),
    conversations: Array.from(conversationsMap.values()),
    messages: messagesResult,
    notes: [],
    tags: TAGS,
    stages: PIPELINE_STAGES,
    templates: [],
    campaigns: [],
  };
}

export async function fetchKapsoData(signal?: AbortSignal) {
  const conversationsRes = await fetch('/api/conversations?limit=100', {
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  if (!conversationsRes.ok) {
    throw new Error(`Failed to fetch conversations: ${conversationsRes.status}`);
  }
  const conversationsData = await conversationsRes.json();
  const conversations: KapsoConversation[] = (conversationsData.data ?? []) as KapsoConversation[];

  const messagesByConversation: Record<string, KapsoMessage[]> = {};

  await Promise.all(
    conversations.map(async (conv) => {
      const params = new URLSearchParams({ limit: '100' });
      if (conv.phoneNumberId) params.set('phoneNumberId', conv.phoneNumberId);
      const res = await fetch(`/api/messages/${conv.id}?${params.toString()}`, {
        signal,
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        messagesByConversation[conv.id] = (data.data ?? []) as KapsoMessage[];
      }
    }),
  );

  return { conversations, messagesByConversation };
}