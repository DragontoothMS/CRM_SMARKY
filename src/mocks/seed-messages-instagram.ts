import type { Message } from '@/types';
import { buildMessages } from './message-factory';

/** Conversaciones de Instagram: sticker, imagen + video, audio con IA apagada y cierre perdido. */
export function createInstagramMessages(now: Date): Record<string, Message[]> {
  return {
    conv_ig_01: buildMessages(now, 'conv_ig_01', 'instagram', [
      {
        id: 'msg_ig_01_01',
        ago: [23, 'h'],
        from: 'contact',
        text: 'Tengo un negocio de accesorios y quiero automatizar las respuestas',
      },
      {
        id: 'msg_ig_01_02',
        ago: [23, 'h'],
        from: 'ai',
        text: '¡Buenísimo! Smarky responde tus DMs automáticamente y te avisa cuando alguien quiere comprar. ¿Cuántos mensajes recibís por día aproximadamente?',
      },
      { id: 'msg_ig_01_03', ago: [22, 'h'], from: 'contact', text: 'Unos 60 o 70' },
      {
        id: 'msg_ig_01_04',
        ago: [21, 'h'],
        from: 'contact',
        type: 'sticker',
        mediaUrl: '/demo/sticker-ok.svg',
      },
    ]),

    conv_ig_02: buildMessages(now, 'conv_ig_02', 'instagram', [
      {
        id: 'msg_ig_02_01',
        ago: [7, 'h'],
        from: 'contact',
        text: 'Hola! Quiero comprar por mayor, ¿tienen lista de precios?',
      },
      {
        id: 'msg_ig_02_02',
        ago: [6, 'h'],
        from: 'human',
        type: 'image',
        mediaUrl: '/demo/image-showroom.svg',
        text: 'Este es el showroom. Los precios mayoristas arrancan en 12 unidades.',
      },
      {
        id: 'msg_ig_02_03',
        ago: [5, 'h'],
        from: 'human',
        type: 'video',
        mediaUrl: '/demo/video-preview.svg',
        text: 'Te grabé cómo queda armado.',
      },
      {
        id: 'msg_ig_02_04',
        ago: [4, 'h'],
        from: 'contact',
        text: 'Me encanta. Armemos un pedido de prueba 🙌',
      },
    ]),

    conv_ig_03: buildMessages(now, 'conv_ig_03', 'instagram', [
      {
        id: 'msg_ig_03_01',
        ago: [9, 'h'],
        from: 'contact',
        type: 'audio',
        mediaUrl: '/demo/audio.wav',
      },
      {
        id: 'msg_ig_03_02',
        ago: [9, 'h'],
        from: 'system',
        type: 'system',
        text: 'Respuesta con IA desactivada por un asesor',
      },
      {
        id: 'msg_ig_03_03',
        ago: [8, 'h'],
        from: 'human',
        text: 'Hola Martina, te escribo yo directamente. Lo del cobro duplicado lo estamos revisando y te confirmo hoy.',
        status: 'read',
      },
    ]),

    conv_ig_04: buildMessages(now, 'conv_ig_04', 'instagram', [
      { id: 'msg_ig_04_01', ago: [6, 'd'], from: 'contact', text: '¿Cuánto sale el plan más barato?' },
      {
        id: 'msg_ig_04_02',
        ago: [6, 'd'],
        from: 'ai',
        text: 'El plan inicial arranca en USD 59 por mes e incluye los tres canales.',
      },
      {
        id: 'msg_ig_04_03',
        ago: [4, 'd'],
        from: 'contact',
        text: 'Gracias, por ahora se me va de presupuesto.',
      },
    ]),
  };
}
