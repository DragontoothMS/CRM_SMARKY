import type { Channel, Message } from '@/types';
import { daysAgo, hoursAgo, minutesAgo } from './seed-helpers';

/** Desplazamiento hacia atrás desde `now`: [cantidad, unidad]. */
export type Ago = [number, 'm' | 'h' | 'd'];

export function at(now: Date, [value, unit]: Ago): string {
  if (unit === 'm') return minutesAgo(now, value);
  if (unit === 'h') return hoursAgo(now, value);
  return daysAgo(now, value);
}

interface MessageSpec {
  id: string;
  ago: Ago;
  /** Por defecto 'text'. */
  type?: Message['contentType'];
  text?: string;
  mediaUrl?: string;
  fileName?: string;
  status?: Message['status'];
}

/**
 * Reduce el ruido de los seeds: cada mensaje declara solo lo que lo distingue.
 * direction y status quedan implícitos en el sender, que es la regla real del
 * dominio (un mensaje del contacto siempre es inbound y no lleva status).
 */
export function buildMessages(
  now: Date,
  conversationId: string,
  channel: Channel,
  specs: Array<MessageSpec & { from: Message['senderType'] }>,
): Message[] {
  return specs.map(({ id, ago, from, type = 'text', status, ...rest }) => {
    const inbound = from === 'contact';
    return {
      id,
      conversationId,
      channel,
      externalMessageId: `demo-${id}`,
      direction: inbound ? 'inbound' : 'outbound',
      senderType: from,
      contentType: type,
      // El sistema y los mensajes entrantes no llevan estado de entrega.
      status: inbound || from === 'system' ? undefined : (status ?? 'read'),
      createdAt: at(now, ago),
      ...rest,
    };
  });
}
