import type { Channel, Contact, Conversation, Message } from '@/types';
import { describeLastMessage } from '@/modules/inbox/utils/conversation-preview';

/** Umbrales de inactividad, en horas. */
const WARNING_HOURS = 24;
const STALE_HOURS = 72;

export type InactivityLevel = 'none' | 'warning' | 'stale';

export interface PipelineCard {
  /** Id del contacto: la etapa vive en Contact, así que es la unidad que se mueve. */
  id: string;
  contact: Contact;
  conversation: Conversation;
  channel: Channel;
  stageId: string;
  aiEnabled: boolean;
  /** Resumen del último mensaje, con el mismo criterio que la lista del Inbox. */
  preview: string;
  lastMessageAt: string;
  hoursInactive: number;
  inactivity: InactivityLevel;
}

function resolveInactivity(hours: number): InactivityLevel {
  if (hours >= STALE_HOURS) return 'stale';
  if (hours >= WARNING_HOURS) return 'warning';
  return 'none';
}

/**
 * Una tarjeta = un contacto + su conversación más reciente.
 *
 * No existe una entidad "oportunidad" en el modelo y crearla duplicaría Contact.
 * Tampoco existe "tiempo en etapa": no hay historial de cambios, así que se
 * muestra la inactividad real derivada de lastMessageAt, que además responde
 * mejor a qué oportunidad necesita atención.
 *
 * Los contactos sin conversación quedan fuera del tablero: no hay nada que
 * atender ni conversación que abrir.
 */
export function buildPipelineCards(
  contacts: Contact[],
  conversations: Conversation[],
  messagesByConversation: Record<string, Message[]>,
  now: string,
): PipelineCard[] {
  const nowMs = new Date(now).getTime();

  return contacts.flatMap((contact) => {
    const conversation = conversations
      .filter((c) => c.contactId === contact.id)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))[0];

    if (!conversation) return [];

    const hoursInactive = Math.max(
      0,
      (nowMs - new Date(conversation.lastMessageAt).getTime()) / 3_600_000,
    );

    return [
      {
        id: contact.id,
        contact,
        conversation,
        channel: conversation.channel,
        stageId: contact.stageId,
        aiEnabled: conversation.aiEnabled,
        preview: describeLastMessage(messagesByConversation[conversation.id] ?? []),
        lastMessageAt: conversation.lastMessageAt,
        hoursInactive,
        inactivity: resolveInactivity(hoursInactive),
      },
    ];
  });
}

/** Texto de la señal de inactividad: "2 d sin actividad". */
export function describeInactivity(hours: number): string {
  if (hours >= STALE_HOURS) {
    return `${Math.floor(hours / 24)} d sin actividad`;
  }
  return `${Math.floor(hours)} h sin actividad`;
}
