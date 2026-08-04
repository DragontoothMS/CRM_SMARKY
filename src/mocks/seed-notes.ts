import type { InternalNote } from '@/types';
import { hoursAgo } from './seed-helpers';
import { WORKSPACE_ID } from './seed-base';
import { CURRENT_USER } from './current-user';

interface NoteSeed {
  id: string;
  conversationId: string;
  body: string;
  agoHours: number;
}

const SEEDS: NoteSeed[] = [
  {
    id: 'note_01',
    conversationId: 'conv_wa_01',
    body: 'Llegó desde la campaña de Instagram. Pidió info de planes: mandarle el comparativo si vuelve a escribir.',
    agoHours: 0.4,
  },
  {
    id: 'note_02',
    conversationId: 'conv_wa_02',
    body: 'Presupuesto enviado por privado. Hacer seguimiento el lunes.',
    agoHours: 3,
  },
  {
    id: 'note_03',
    conversationId: 'conv_wa_03',
    body: 'Contrato anual firmado. Coordinar el onboarding con el equipo técnico.',
    agoHours: 25,
  },
  {
    id: 'note_04',
    conversationId: 'conv_ig_02',
    body: 'Mayorista con potencial. Pidió 12 unidades de prueba.',
    agoHours: 4,
  },
  {
    id: 'note_05',
    conversationId: 'conv_ig_03',
    body: 'Cobro duplicado del 12/03. Escalado a administración, IA apagada mientras se resuelve.',
    agoHours: 8,
  },
  {
    id: 'note_06',
    conversationId: 'conv_ms_02',
    body: 'Decide el directorio. Sensible al precio, insistir con el plan anual.',
    agoHours: 6,
  },
];

export function createInternalNotes(now: Date): InternalNote[] {
  return SEEDS.map(({ agoHours, ...note }) => ({
    ...note,
    workspaceId: WORKSPACE_ID,
    authorId: CURRENT_USER.id,
    createdAt: hoursAgo(now, agoHours),
  }));
}
