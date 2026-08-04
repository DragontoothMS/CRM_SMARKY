import type { WhatsAppTemplate } from '@/types';
import { presentedStatus } from './template-status';

/**
 * Acciones locales disponibles para una plantilla. Fuente única: filas, cards y
 * detalle la consumen para no repetir condicionales. Solo acciones LOCALES;
 * nunca aprobar/rechazar/pausar/sincronizar/eliminar en Meta (eso es de Meta).
 */
export type TemplateAction = 'edit' | 'correct' | 'submit' | 'duplicate' | 'disable' | 'enable' | 'delete' | 'restore';

export function availableTemplateActions(t: WhatsAppTemplate): TemplateAction[] {
  if (t.localStatus === 'deleted') return ['restore'];
  if (t.localStatus === 'disabled') return ['enable', 'duplicate', 'delete'];
  if (t.localStatus === 'draft') return ['edit', 'submit', 'duplicate', 'delete'];

  // localStatus === 'active': el conjunto depende del estado remoto presentado.
  const ps = presentedStatus(t);
  if (ps === 'rejected') return ['correct', 'duplicate', 'delete'];
  if (ps === 'pending') return ['duplicate', 'delete'];
  // approved (incl. out_of_sync), paused, archived, unknown, remote_disabled,
  // pending_deletion, limit_exceeded, remote_deleted → mismo conjunto.
  return ['duplicate', 'disable', 'delete'];
}
