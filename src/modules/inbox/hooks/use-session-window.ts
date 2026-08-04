'use client';

import type { Conversation, Message } from '@/types';
import { CHANNELS_WITH_SESSION_WINDOW, SESSION_WINDOW_HOURS } from '@/lib/channels';
import { useInbox } from './use-inbox';

export interface SessionWindow {
  /** false cuando el canal no tiene ventana de sesión (Instagram, Messenger). */
  applies: boolean;
  isOpen: boolean;
  hoursSinceLastInbound: number | null;
}

/**
 * Ventana de 24 h de WhatsApp: fuera de ella solo se puede iniciar con plantilla.
 * Se mide contra el último mensaje entrante y contra `seededAt`, no contra
 * Date.now(), para que coincida con las fechas que muestra la UI.
 */
export function useSessionWindow(
  conversation: Conversation | null,
  messages: Message[],
): SessionWindow {
  const { state } = useInbox();

  if (!conversation || !CHANNELS_WITH_SESSION_WINDOW.includes(conversation.channel)) {
    return { applies: false, isOpen: true, hoursSinceLastInbound: null };
  }

  const lastInbound = [...messages].reverse().find((m) => m.direction === 'inbound');
  if (!lastInbound) return { applies: true, isOpen: false, hoursSinceLastInbound: null };

  const elapsedHours =
    (new Date(state.seededAt).getTime() - new Date(lastInbound.createdAt).getTime()) / 3_600_000;

  return {
    applies: true,
    isOpen: elapsedHours < SESSION_WINDOW_HOURS,
    hoursSinceLastInbound: Math.floor(elapsedHours),
  };
}
