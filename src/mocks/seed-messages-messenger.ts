import type { Message } from '@/types';
import { buildMessages } from './message-factory';

/** Conversaciones de Messenger: plantilla, documento, sticker en trato ganado y aviso de sistema. */
export function createMessengerMessages(now: Date): Record<string, Message[]> {
  return {
    conv_ms_01: buildMessages(now, 'conv_ms_01', 'messenger', [
      {
        id: 'msg_ms_01_01',
        ago: [4, 'h'],
        from: 'human',
        type: 'template',
        text: 'Hola Valentina, gracias por escribirnos a Smarky. Un asesor te responde en breve dentro del horario de atención.',
      },
      { id: 'msg_ms_01_02', ago: [3, 'h'], from: 'contact', text: 'Hola! Necesito ayuda con un pedido' },
      {
        id: 'msg_ms_01_03',
        ago: [3, 'h'],
        from: 'ai',
        text: 'Claro. ¿Me pasás el número de pedido así lo busco?',
      },
      { id: 'msg_ms_01_04', ago: [2, 'h'], from: 'contact', text: 'Es el #48213' },
    ]),

    conv_ms_02: buildMessages(now, 'conv_ms_02', 'messenger', [
      {
        id: 'msg_ms_02_01',
        ago: [2, 'd'],
        from: 'contact',
        text: 'Necesito una propuesta formal para presentar en el directorio.',
      },
      {
        id: 'msg_ms_02_02',
        ago: [1, 'd'],
        from: 'human',
        text: 'Te la preparo hoy mismo, Federico.',
      },
      {
        id: 'msg_ms_02_03',
        ago: [7, 'h'],
        from: 'human',
        type: 'document',
        mediaUrl: '/demo/documento.txt',
        fileName: 'Propuesta-Comercial-Smarky.pdf',
      },
      {
        id: 'msg_ms_02_04',
        ago: [6, 'h'],
        from: 'contact',
        text: 'Recibido, lo veo con el equipo esta semana.',
      },
    ]),

    conv_ms_03: buildMessages(now, 'conv_ms_03', 'messenger', [
      { id: 'msg_ms_03_01', ago: [3, 'd'], from: 'contact', text: 'Listo, ya hicimos la transferencia.' },
      {
        id: 'msg_ms_03_02',
        ago: [3, 'd'],
        from: 'human',
        text: '¡Confirmado! Bienvenida a Smarky, Agustina.',
      },
      {
        id: 'msg_ms_03_03',
        ago: [52, 'h'],
        from: 'system',
        type: 'system',
        text: 'La conversación pasó a la etapa Ganado',
      },
      {
        id: 'msg_ms_03_04',
        ago: [50, 'h'],
        from: 'contact',
        type: 'sticker',
        mediaUrl: '/demo/sticker-gracias.svg',
      },
    ]),

    conv_ms_04: buildMessages(now, 'conv_ms_04', 'messenger', [
      {
        id: 'msg_ms_04_01',
        ago: [4, 'd'],
        from: 'system',
        type: 'system',
        text: 'Conversación iniciada desde un anuncio de Messenger',
      },
      { id: 'msg_ms_04_02', ago: [4, 'd'], from: 'contact', text: 'Vi el anuncio, ¿qué es Smarky?' },
      {
        id: 'msg_ms_04_03',
        ago: [72, 'h'],
        from: 'ai',
        text: 'Es una plataforma que unifica WhatsApp, Instagram y Messenger en un solo lugar y responde por vos. ¿Te muestro cómo funciona?',
        status: 'sent',
      },
    ]),
  };
}
