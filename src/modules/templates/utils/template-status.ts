import type {
  KnownRemoteStatus,
  TemplateRemoteStatus,
  WhatsAppTemplate,
} from '@/types';

/**
 * Derivadores puros del estado de una plantilla. Única fuente de la lógica de
 * estado presentado y de elegibilidad: list, card, detail y Campañas la importan
 * de aquí para no divergir.
 */

/** Estado único que la UI muestra como badge, derivado de los tres ejes. */
export type PresentedStatus =
  | 'draft'
  | 'local_disabled'
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'paused'
  | 'in_appeal'
  | 'pending_deletion'
  | 'archived'
  | 'limit_exceeded'
  | 'remote_disabled'
  | 'remote_deleted'
  | 'deleted'
  | 'unknown';

const REMOTE_TO_PRESENTED: Record<KnownRemoteStatus, PresentedStatus> = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
  paused: 'paused',
  in_appeal: 'in_appeal',
  pending_deletion: 'pending_deletion',
  archived: 'archived',
  limit_exceeded: 'limit_exceeded',
  disabled: 'remote_disabled', // distinto de 'local_disabled'
  deleted: 'remote_deleted', // distinto de 'deleted' (papelera local)
};

/**
 * Prioridad local → remoto. Los estados locales `deleted`/`disabled` son
 * decisiones nuestras y ganan al badge; para una plantilla `active`, el badge
 * refleja el estado remoto. Una `active` con remoteStatus null es una
 * combinación inconsistente y se presenta como 'unknown'.
 */
export function presentedStatus(t: WhatsAppTemplate): PresentedStatus {
  if (t.localStatus === 'deleted') return 'deleted';
  if (t.localStatus === 'disabled') return 'local_disabled';
  if (t.localStatus === 'draft') return 'draft';
  // localStatus === 'active'
  if (t.remoteStatus === null) return 'unknown'; // inconsistente: active sin remoto
  if (t.remoteStatus === 'unknown') return 'unknown';
  return REMOTE_TO_PRESENTED[t.remoteStatus];
}

export interface SyncPresentation {
  label: string;
  /** 'waiting' = espera normal (En revisión); 'diverged' = anomalía a resolver. */
  tone: 'waiting' | 'diverged';
}

/**
 * Presentación única del estado de sincronización. Centraliza el texto para que
 * ningún componente interprete syncStatus por su cuenta. Diferencia la espera
 * normal ("Sincronización pendiente", p. ej. una En revisión) de la divergencia
 * real ("Sin sincronizar"), para no hacer parecer un error lo que no lo es.
 * Solo aplica a plantillas activas; `never_synced` y `synced` no muestran chip.
 */
export function getSyncPresentation(t: WhatsAppTemplate): SyncPresentation | null {
  if (t.localStatus !== 'active') return null;
  if (t.syncStatus === 'pending_sync') return { label: 'Sincronización pendiente', tone: 'waiting' };
  if (t.syncStatus === 'out_of_sync') return { label: 'Sin sincronizar', tone: 'diverged' };
  return null;
}

/** ¿La plantilla muestra chip de sincronización? Deriva de getSyncPresentation. */
export function needsSyncChip(t: WhatsAppTemplate): boolean {
  return getSyncPresentation(t) !== null;
}

/** Lectura única del veredicto de rechazo remoto (motivo, mensajes de corrección). */
export function isRejected(t: WhatsAppTemplate): boolean {
  return t.remoteStatus === 'rejected';
}

/**
 * Compuerta de elegibilidad para programar/enviar una campaña. LISTA BLANCA:
 * únicamente esta combinación exacta devuelve true. Cualquier otro estado
 * (borrador, deshabilitada, pausada, sin sincronizar, remoto no aprobado,
 * desconocido, sin contraparte remota) queda excluido.
 */
export function canScheduleOrSend(t: WhatsAppTemplate): boolean {
  return (
    t.localStatus === 'active' &&
    t.remoteStatus === 'approved' &&
    t.syncStatus === 'synced'
  );
}

const KNOWN_REMOTE_STATUSES: readonly KnownRemoteStatus[] = [
  'approved',
  'pending',
  'rejected',
  'paused',
  'disabled',
  'in_appeal',
  'pending_deletion',
  'deleted',
  'archived',
  'limit_exceeded',
];

/**
 * Borde de normalización del estado remoto: minusculiza y mapea a un valor
 * conocido; cualquier valor no reconocido → 'unknown' (tolerancia a estados
 * futuros de Meta). No se usa en el mock —donde el seed ya trae valores
 * válidos— pero la puerta queda lista para la integración real.
 */
export function normalizeRemoteStatus(raw: string): TemplateRemoteStatus {
  const value = raw.trim().toLowerCase();
  return (KNOWN_REMOTE_STATUSES as readonly string[]).includes(value)
    ? (value as KnownRemoteStatus)
    : 'unknown';
}
