/**
 * Plantilla de WhatsApp.
 *
 * El estado de una plantilla vive en TRES ejes independientes; no hay un `status`
 * plano. Colapsarlos haría imposible representar casos reales (p. ej. "aprobada
 * por Meta pero editada localmente y aún sin re-sincronizar").
 *
 *  1. localStatus  — ciclo de vida DENTRO de nuestro CRM. Lo decidimos nosotros.
 *  2. remoteStatus — lo que informa el proveedor remoto (Meta hoy). `null` = aún
 *                    no existe contraparte remota (nunca se creó ni envió).
 *  3. syncStatus   — relación entre la copia local y el último remoto conocido.
 *
 * Contrato compartido: Campañas lo consume vía `canScheduleOrSend()`; el módulo
 * Plantillas es dueño de su gestión.
 */
export type TemplateCategory = 'marketing' | 'utility' | 'authentication';

/** Eje 1 — ciclo de vida local (nuestro CRM es dueño). */
export type TemplateLocalStatus = 'draft' | 'active' | 'disabled' | 'deleted';

/**
 * Eje 2 — valores que el proveedor remoto puede informar, normalizados a
 * minúsculas en el borde. Meta puede devolver más estados en el futuro: por eso
 * el union se cierra con `'unknown'` como fallback tolerante.
 */
export type KnownRemoteStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'paused'
  | 'disabled'
  | 'in_appeal'
  | 'pending_deletion'
  | 'deleted'
  | 'archived'
  | 'limit_exceeded';

/**
 * `'unknown'` = el proveedor devolvió un valor remoto que no reconocemos. NO se
 * usa para plantillas nuevas, nunca enviadas, ausencia de conexión ni ausencia
 * de contraparte remota: para todo eso, `remoteStatus` es `null`.
 */
export type TemplateRemoteStatus = KnownRemoteStatus | 'unknown';

/** Eje 3 — sincronización local ↔ último remoto conocido. */
export type TemplateSyncStatus = 'never_synced' | 'synced' | 'pending_sync' | 'out_of_sync';

export interface TemplateVariable {
  /** Marcador dentro del body, p. ej. "{{1}}". */
  key: string;
  /** Valor de ejemplo para la vista previa. */
  example: string;
}

export interface WhatsAppTemplate {
  id: string;
  workspaceId: string;
  name: string;
  category: TemplateCategory;
  /** Código de idioma libre ("es", "es_AR", "en"); no se restringe a un union. */
  language: string;
  body: string;
  variables: TemplateVariable[];

  localStatus: TemplateLocalStatus;
  /** `null` significa que nunca se creó o envió una contraparte remota. */
  remoteStatus: TemplateRemoteStatus | null;
  syncStatus: TemplateSyncStatus;

  /** Solo poblado cuando remoteStatus === 'rejected'. */
  rejectionReason: string | null;
  /**
   * Estado local previo al soft-delete, para que RESTORE sea determinista y no
   * adivine. Nunca es 'deleted' por construcción.
   */
  previousLocalStatus: Exclude<TemplateLocalStatus, 'deleted'> | null;

  createdAt: string;
  updatedAt: string;
  /** null si nunca se sincronizó. */
  lastSyncedAt: string | null;
}

/*
 * Integración real (reservado, NO en esta iteración): agregar `remoteStatusRaw?:
 * string` para conservar el valor original recibido de Meta cuando
 * normalizeRemoteStatus() devuelva 'unknown'. No se carga el mock con datos que
 * todavía no recibimos.
 */
