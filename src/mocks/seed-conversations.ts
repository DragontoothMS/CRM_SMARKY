import type { Conversation } from '@/types';
import { daysAgo, hoursAgo, minutesAgo } from './seed-helpers';
import { WORKSPACE_ID } from './seed-base';

type ConversationSeed = Omit<
  Conversation,
  'workspaceId' | 'lastMessageAt' | 'createdAt'
> & {
  lastMessage: { unit: 'm' | 'h' | 'd'; value: number };
  createdDaysAgo: number;
};

const SEEDS: ConversationSeed[] = [
  {
    id: 'conv_wa_01',
    contactId: 'ct_wa_01',
    channelAccountId: 'acc_wa_01',
    channel: 'whatsapp',
    externalConversationId: 'demo-wa-conv-01',
    status: 'open',
    aiEnabled: true,
    unreadCount: 2,
    lastMessageId: 'msg_wa_01_08',
    lastMessage: { unit: 'm', value: 1 },
    createdDaysAgo: 0,
  },
  {
    id: 'conv_wa_02',
    contactId: 'ct_wa_02',
    channelAccountId: 'acc_wa_01',
    channel: 'whatsapp',
    externalConversationId: 'demo-wa-conv-02',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_wa_02_05',
    lastMessage: { unit: 'm', value: 180 },
    createdDaysAgo: 9,
  },
  {
    id: 'conv_wa_03',
    contactId: 'ct_wa_03',
    channelAccountId: 'acc_wa_01',
    channel: 'whatsapp',
    externalConversationId: 'demo-wa-conv-03',
    status: 'open',
    // IA apagada: lo atiende un asesor humano tras el cierre.
    aiEnabled: false,
    unreadCount: 0,
    lastMessageId: 'msg_wa_03_05',
    lastMessage: { unit: 'h', value: 26 },
    createdDaysAgo: 21,
  },
  {
    // Fuera de la ventana de 24 h de WhatsApp: el último inbound fue hace 30 h.
    id: 'conv_wa_04',
    contactId: 'ct_wa_04',
    channelAccountId: 'acc_wa_01',
    channel: 'whatsapp',
    externalConversationId: 'demo-wa-conv-04',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_wa_04_03',
    lastMessage: { unit: 'h', value: 30 },
    createdDaysAgo: 6,
  },
  {
    id: 'conv_wa_05',
    contactId: 'ct_wa_05',
    channelAccountId: 'acc_wa_01',
    channel: 'whatsapp',
    externalConversationId: 'demo-wa-conv-05',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_wa_05_03',
    lastMessage: { unit: 'h', value: 5 },
    createdDaysAgo: 2,
  },
  {
    id: 'conv_ig_01',
    contactId: 'ct_ig_01',
    channelAccountId: 'acc_ig_01',
    channel: 'instagram',
    externalConversationId: 'demo-ig-conv-01',
    status: 'open',
    aiEnabled: true,
    unreadCount: 1,
    lastMessageId: 'msg_ig_01_04',
    lastMessage: { unit: 'h', value: 21 },
    createdDaysAgo: 1,
  },
  {
    id: 'conv_ig_02',
    contactId: 'ct_ig_02',
    channelAccountId: 'acc_ig_01',
    channel: 'instagram',
    externalConversationId: 'demo-ig-conv-02',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_ig_02_04',
    lastMessage: { unit: 'h', value: 4 },
    createdDaysAgo: 12,
  },
  {
    id: 'conv_ig_03',
    contactId: 'ct_ig_03',
    channelAccountId: 'acc_ig_01',
    channel: 'instagram',
    externalConversationId: 'demo-ig-conv-03',
    status: 'open',
    // IA apagada: la consulta pasó a soporte humano.
    aiEnabled: false,
    unreadCount: 0,
    lastMessageId: 'msg_ig_03_03',
    lastMessage: { unit: 'h', value: 8 },
    createdDaysAgo: 3,
  },
  {
    id: 'conv_ig_04',
    contactId: 'ct_ig_04',
    channelAccountId: 'acc_ig_01',
    channel: 'instagram',
    externalConversationId: 'demo-ig-conv-04',
    status: 'closed',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_ig_04_03',
    lastMessage: { unit: 'd', value: 4 },
    createdDaysAgo: 30,
  },
  {
    id: 'conv_ms_01',
    contactId: 'ct_ms_01',
    channelAccountId: 'acc_ms_01',
    channel: 'messenger',
    externalConversationId: 'demo-ms-conv-01',
    status: 'open',
    aiEnabled: true,
    unreadCount: 3,
    lastMessageId: 'msg_ms_01_04',
    lastMessage: { unit: 'h', value: 2 },
    createdDaysAgo: 4,
  },
  {
    id: 'conv_ms_02',
    contactId: 'ct_ms_02',
    channelAccountId: 'acc_ms_01',
    channel: 'messenger',
    externalConversationId: 'demo-ms-conv-02',
    status: 'open',
    // IA apagada: negociación abierta, la lleva el equipo comercial.
    aiEnabled: false,
    unreadCount: 0,
    lastMessageId: 'msg_ms_02_04',
    lastMessage: { unit: 'h', value: 6 },
    createdDaysAgo: 15,
  },
  {
    id: 'conv_ms_03',
    contactId: 'ct_ms_03',
    channelAccountId: 'acc_ms_01',
    channel: 'messenger',
    externalConversationId: 'demo-ms-conv-03',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_ms_03_04',
    lastMessage: { unit: 'h', value: 50 },
    createdDaysAgo: 40,
  },
  {
    id: 'conv_ms_04',
    contactId: 'ct_ms_04',
    channelAccountId: 'acc_ms_01',
    channel: 'messenger',
    externalConversationId: 'demo-ms-conv-04',
    status: 'open',
    aiEnabled: true,
    unreadCount: 0,
    lastMessageId: 'msg_ms_04_03',
    lastMessage: { unit: 'h', value: 72 },
    createdDaysAgo: 5,
  },
];

function resolveTimestamp(now: Date, spec: ConversationSeed['lastMessage']): string {
  if (spec.unit === 'm') return minutesAgo(now, spec.value);
  if (spec.unit === 'h') return hoursAgo(now, spec.value);
  return daysAgo(now, spec.value);
}

export function createConversations(now: Date): Conversation[] {
  return SEEDS.map(({ lastMessage, createdDaysAgo, ...conversation }) => ({
    ...conversation,
    workspaceId: WORKSPACE_ID,
    lastMessageAt: resolveTimestamp(now, lastMessage),
    createdAt: daysAgo(now, createdDaysAgo),
  }));
}
