import type { TemplateCategory, WhatsAppTemplate } from '@/types';
import { presentedStatus, type PresentedStatus } from './template-status';

/** Etiquetas legibles de categoría, compartidas por filtros, filas y detalle. */
export const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  marketing: 'Marketing',
  utility: 'Utilidad',
  authentication: 'Autenticación',
};

/**
 * Agrupación pura de filtros de la lista de Plantillas. No duplica
 * presentedStatus/needsSyncChip: los consume. La UI solo elige una clave; toda
 * la lógica de pertenencia vive aquí.
 */
export type TemplateStatusFilter =
  | 'all'
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'paused'
  | 'disabled'
  | 'problems'
  | 'trash';

/** Estados presentados que cuentan como "problema" que requiere atención. */
const PROBLEM_PRESENTED: ReadonlySet<PresentedStatus> = new Set<PresentedStatus>([
  'unknown',
  'remote_disabled',
  'archived',
  'limit_exceeded',
  'pending_deletion',
  'remote_deleted',
]);

/**
 * "Con problemas": estado remoto anómalo, o una activa cuya copia local diverge
 * del remoto (out_of_sync). Nunca incluye la papelera (deleted local).
 */
export function isProblemTemplate(t: WhatsAppTemplate): boolean {
  if (t.localStatus === 'deleted') return false;
  if (PROBLEM_PRESENTED.has(presentedStatus(t))) return true;
  return t.localStatus === 'active' && t.syncStatus === 'out_of_sync';
}

/**
 * ¿La plantilla pertenece al filtro dado? Los buckets basados en presentedStatus
 * excluyen la papelera automáticamente (una deleted presenta 'deleted'). Solo
 * 'all' necesita excluir deleted explícitamente; 'trash' la incluye en exclusiva.
 */
export function matchesStatusFilter(t: WhatsAppTemplate, filter: TemplateStatusFilter): boolean {
  switch (filter) {
    case 'all':
      return t.localStatus !== 'deleted';
    case 'trash':
      return t.localStatus === 'deleted';
    case 'problems':
      return isProblemTemplate(t);
    case 'draft':
      return presentedStatus(t) === 'draft';
    case 'pending':
      return presentedStatus(t) === 'pending';
    case 'approved':
      return presentedStatus(t) === 'approved';
    case 'rejected':
      return presentedStatus(t) === 'rejected';
    case 'paused':
      return presentedStatus(t) === 'paused';
    case 'disabled':
      return presentedStatus(t) === 'local_disabled';
    default: {
      const exhaustive: never = filter;
      return exhaustive;
    }
  }
}

/** Coincidencia de búsqueda por nombre, body o idioma (case-insensitive). */
export function matchesSearch(t: WhatsAppTemplate, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    t.name.toLowerCase().includes(q) ||
    t.body.toLowerCase().includes(q) ||
    t.language.toLowerCase().includes(q)
  );
}
