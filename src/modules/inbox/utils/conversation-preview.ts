import type { Message } from '@/types';

/** Resumen del último mensaje para la fila de la lista. */
export function describeLastMessage(messages: Message[]): string {
  const last = messages[messages.length - 1];
  if (!last) return 'Sin mensajes';
  switch (last.contentType) {
    case 'image':
      return '📷 Foto';
    case 'video':
      return '🎬 Video';
    case 'audio':
      return '🎤 Audio';
    case 'document':
      return `📄 ${last.fileName ?? 'Documento'}`;
    case 'sticker':
      return '⭐ Sticker';
    default:
      return last.text ?? '';
  }
}
