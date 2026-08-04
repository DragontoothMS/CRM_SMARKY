import type { Message } from '@/types';
import { isSameDay } from '@/lib/format';

const GROUP_WINDOW_MS = 5 * 60_000;

/** Estos tipos se renderizan sueltos o con peso visual propio: nunca comparten grupo. */
const STANDALONE_TYPES = new Set<Message['contentType']>(['system', 'sticker']);

export interface MessageGroup {
  /** Id del primer mensaje: sirve de key estable. */
  id: string;
  messages: Message[];
}

export interface DayBucket {
  day: string;
  groups: MessageGroup[];
}

/**
 * Un mensaje que falló nunca se agrupa: su estado tiene que quedar visible, y en
 * un grupo solo se muestra el del último mensaje.
 */
function isStandalone(message: Message): boolean {
  return STANDALONE_TYPES.has(message.contentType) || message.status === 'failed';
}

/** Continúa el grupo solo si coinciden autor, dirección, día y la ventana de 5 min. */
function continuesGroup(previous: Message, current: Message): boolean {
  if (isStandalone(previous) || isStandalone(current)) return false;
  if (previous.senderType !== current.senderType) return false;
  if (previous.direction !== current.direction) return false;

  const previousAt = new Date(previous.createdAt);
  const currentAt = new Date(current.createdAt);
  if (!isSameDay(previousAt, currentAt)) return false;

  return currentAt.getTime() - previousAt.getTime() < GROUP_WINDOW_MS;
}

/**
 * Agrupa por día y, dentro del día, por autor consecutivo.
 *
 * El badge de autor se muestra en el primero del grupo y la hora en el último
 * (ver message-bubble), así una ráfaga de la IA deja de repetir "IA · 20:32"
 * cinco veces. El estado de entrega también va en el último saliente, salvo que
 * un mensaje haya fallado: ese queda solo y conserva su propio estado.
 */
export function groupMessages(messages: Message[]): DayBucket[] {
  const days: DayBucket[] = [];

  for (const message of messages) {
    const currentDay = days[days.length - 1];
    const sameDay =
      currentDay && isSameDay(new Date(currentDay.day), new Date(message.createdAt));

    if (!sameDay) {
      days.push({ day: message.createdAt, groups: [{ id: message.id, messages: [message] }] });
      continue;
    }

    const lastGroup = currentDay.groups[currentDay.groups.length - 1];
    const previous = lastGroup.messages[lastGroup.messages.length - 1];

    if (continuesGroup(previous, message)) {
      lastGroup.messages.push(message);
    } else {
      currentDay.groups.push({ id: message.id, messages: [message] });
    }
  }

  return days;
}
