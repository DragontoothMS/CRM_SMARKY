import type { Message } from '@/types';
import { buildMessages } from './message-factory';

/** Conversaciones de WhatsApp: texto con IA, imagen, documento, fuera de ventana y audio. */
export function createWhatsappMessages(now: Date): Record<string, Message[]> {
  return {
    conv_wa_01: buildMessages(now, 'conv_wa_01', 'whatsapp', [
      { id: 'msg_wa_01_01', ago: [38, 'm'], from: 'contact', text: 'Hola buenas' },
      {
        id: 'msg_wa_01_02',
        ago: [37, 'm'],
        from: 'ai',
        text: 'Hola, soy el asistente de Smarky. Contame en qué te puedo ayudar: ¿querés info sobre planes, integraciones o cómo automatizar tu atención?',
      },
      { id: 'msg_wa_01_03', ago: [30, 'm'], from: 'contact', text: 'Quiero más info sobre Smarky' },
      {
        id: 'msg_wa_01_04',
        ago: [29, 'm'],
        from: 'ai',
        text: 'Smarky centraliza WhatsApp, Instagram y Messenger en un solo inbox, con etiquetas, pipeline y respuestas automáticas. ¿Querés que te recomiende un plan según tu volumen de conversaciones?',
      },
      {
        id: 'msg_wa_01_05',
        ago: [6, 'm'],
        from: 'contact',
        text: '¿Qué tipos de negocios pueden usarlo?',
      },
      // Ráfaga de tres respuestas seguidas de la IA dentro de la ventana de 5 min:
      // se agrupan, con el badge "IA" solo arriba y la hora solo abajo.
      {
        id: 'msg_wa_01_06',
        ago: [3, 'm'],
        from: 'ai',
        text: 'Sobre todo e-commerce y retail, gastronomía y delivery.',
      },
      {
        id: 'msg_wa_01_07',
        ago: [2, 'm'],
        from: 'ai',
        text: 'También servicios profesionales, clínicas, educación e inmobiliarias.',
      },
      {
        id: 'msg_wa_01_08',
        ago: [1, 'm'],
        from: 'ai',
        text: 'Ideal para ventas, reservas, soporte y gestión de leads. ¿Querés que te recomiende un plan?',
        status: 'delivered',
      },
    ]),

    conv_wa_02: buildMessages(now, 'conv_wa_02', 'whatsapp', [
      {
        id: 'msg_wa_02_01',
        ago: [5, 'h'],
        from: 'contact',
        text: '¡Hola! ¿Me pasás el catálogo actualizado?',
      },
      {
        id: 'msg_wa_02_02',
        ago: [5, 'h'],
        from: 'human',
        type: 'image',
        mediaUrl: '/demo/image-catalogo.svg',
        text: 'Te dejo la selección de esta semana.',
      },
      {
        id: 'msg_wa_02_03',
        ago: [4, 'h'],
        from: 'contact',
        text: 'Me interesa el segundo. ¿Hacen envíos a Rosario?',
      },
      {
        id: 'msg_wa_02_04',
        ago: [181, 'm'],
        from: 'human',
        text: 'Sí, llega en 48 h. Te preparo el presupuesto y te lo mando por acá.',
        status: 'read',
      },
      // Sale del mismo autor un minuto después: sin la regla de error se
      // agruparía con el anterior. Al fallar queda solo y conserva su estado.
      {
        id: 'msg_wa_02_05',
        ago: [180, 'm'],
        from: 'human',
        text: 'Te adjunto el presupuesto en PDF.',
        status: 'failed',
      },
    ]),

    conv_wa_03: buildMessages(now, 'conv_wa_03', 'whatsapp', [
      { id: 'msg_wa_03_01', ago: [3, 'd'], from: 'contact', text: 'Quedamos en el plan anual.' },
      {
        id: 'msg_wa_03_02',
        ago: [3, 'd'],
        from: 'human',
        text: 'Perfecto Mariano. Te paso el contrato para revisar.',
      },
      {
        id: 'msg_wa_03_03',
        ago: [2, 'd'],
        from: 'human',
        type: 'document',
        mediaUrl: '/demo/documento.txt',
        fileName: 'Contrato-Smarky-Anual.pdf',
      },
      {
        id: 'msg_wa_03_04',
        ago: [28, 'h'],
        from: 'contact',
        text: 'Firmado y enviado. ¡Gracias!',
      },
      {
        id: 'msg_wa_03_05',
        ago: [26, 'h'],
        from: 'system',
        type: 'system',
        text: 'La conversación pasó a la etapa Ganado',
      },
    ]),

    conv_wa_04: buildMessages(now, 'conv_wa_04', 'whatsapp', [
      {
        id: 'msg_wa_04_01',
        ago: [32, 'h'],
        from: 'contact',
        text: 'No encuentro cómo conectar mi número.',
      },
      {
        id: 'msg_wa_04_02',
        ago: [31, 'h'],
        from: 'ai',
        text: 'Se hace desde Integraciones → Conexiones. Si querés te guío paso a paso.',
      },
      // Último inbound hace 30 h: la ventana de 24 h está cerrada.
      { id: 'msg_wa_04_03', ago: [30, 'h'], from: 'contact', text: 'Dale, lo miro y te aviso.' },
    ]),

    conv_wa_05: buildMessages(now, 'conv_wa_05', 'whatsapp', [
      { id: 'msg_wa_05_01', ago: [6, 'h'], from: 'contact', text: 'Buenas, consulta rápida' },
      {
        id: 'msg_wa_05_02',
        ago: [6, 'h'],
        from: 'contact',
        type: 'audio',
        mediaUrl: '/demo/audio.wav',
      },
      {
        id: 'msg_wa_05_03',
        ago: [5, 'h'],
        from: 'ai',
        text: 'Escuché tu audio. Sí, podés migrar tus contactos desde una planilla al importarlos en Contactos.',
        status: 'delivered',
      },
    ]),
  };
}
