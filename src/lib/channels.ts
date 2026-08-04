import { Camera, MessageCircle, Send, type LucideIcon } from 'lucide-react';
import type { Channel } from '@/types';

interface ChannelMeta {
  label: string;
  icon: LucideIcon;
  /** Clase de fondo del distintivo. Instagram usa degradado vía globals.css. */
  badgeClass: string;
  /** Color de texto para pills sobre fondo claro. */
  textClass: string;
  kind: 'solid' | 'gradient';
  /** Etiqueta del identificador que muestra este canal. */
  identityLabel: string;
}

/**
 * Fuente única de verdad de los canales. Agregar un cuarto canal es sumar una
 * entrada acá y el valor al tipo Channel: la UI no necesita cambios.
 * Sin logos oficiales: iconos de lucide-react + CSS.
 */
export const CHANNEL_META: Record<Channel, ChannelMeta> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageCircle,
    badgeClass: 'bg-channel-whatsapp',
    textClass: 'text-channel-whatsapp',
    kind: 'solid',
    identityLabel: 'Teléfono',
  },
  instagram: {
    label: 'Instagram',
    icon: Camera,
    badgeClass: 'channel-instagram-bg',
    textClass: 'text-[#dd2a7b]',
    kind: 'gradient',
    identityLabel: 'Usuario',
  },
  messenger: {
    label: 'Messenger',
    icon: Send,
    badgeClass: 'bg-channel-messenger',
    textClass: 'text-channel-messenger',
    kind: 'solid',
    identityLabel: 'Usuario',
  },
};

/** La ventana de 24 h de sesión solo aplica a WhatsApp. */
export const CHANNELS_WITH_SESSION_WINDOW: readonly Channel[] = ['whatsapp'];

export const SESSION_WINDOW_HOURS = 24;
