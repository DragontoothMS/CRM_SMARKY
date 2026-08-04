import type { WhatsAppTemplate } from '@/types';
import { WORKSPACE_ID } from './seed-base';
import { daysAgo, hoursAgo } from './seed-helpers';

/**
 * Plantillas de WhatsApp demo. Cubren las tres categorías y, sobre todo, todos
 * los estados presentables del modelo de tres ejes (local / remoto / sync), para
 * validar badges, chip de sincronización y la compuerta canScheduleOrSend.
 *
 * Invariantes representadas (ver template-status.ts):
 *  · Borrador nuevo:   draft   / null     / never_synced
 *  · Enviada a revisión: active / pending  / pending_sync
 *  · Aprobada usable:  active  / approved / synced        → canScheduleOrSend
 *
 * Las 4 aprobadas+synced son las que Campañas ya usaba como elegibles; se
 * conservan enviables para no romper las campañas sembradas que las referencian.
 * `{{1}}`, `{{2}}` son los marcadores de variable de Meta.
 */
export function createTemplates(now: Date): WhatsAppTemplate[] {
  return [
    // ── Aprobadas + synced (elegibles para campañas) ──────────────────────
    {
      id: 'tpl_promo_lanzamiento',
      workspaceId: WORKSPACE_ID,
      name: 'promo_lanzamiento',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, lanzamos la nueva colección con 20% off por tiempo limitado. ¿Querés que te pasemos el catálogo?',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 40),
      updatedAt: daysAgo(now, 38),
      lastSyncedAt: daysAgo(now, 38),
    },
    {
      id: 'tpl_recordatorio_turno',
      workspaceId: WORKSPACE_ID,
      name: 'recordatorio_turno',
      category: 'utility',
      language: 'es_AR',
      body: 'Hola {{1}}, te recordamos tu turno para el {{2}}. Respondé este mensaje si necesitás reprogramar.',
      variables: [
        { key: '{{1}}', example: 'Camila' },
        { key: '{{2}}', example: '12 de agosto a las 15:00' },
      ],
      localStatus: 'active',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 35),
      updatedAt: daysAgo(now, 33),
      lastSyncedAt: daysAgo(now, 33),
    },
    {
      id: 'tpl_reactivacion',
      workspaceId: WORKSPACE_ID,
      name: 'reactivacion_clientes',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, hace un tiempo que no sabemos de vos. Tenemos novedades que te pueden interesar. ¿Retomamos la charla?',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 30),
      updatedAt: daysAgo(now, 28),
      lastSyncedAt: daysAgo(now, 28),
    },
    {
      id: 'tpl_codigo_verificacion',
      workspaceId: WORKSPACE_ID,
      name: 'codigo_verificacion',
      category: 'authentication',
      language: 'es',
      body: 'Tu código de verificación de Smarky es {{1}}. No lo compartas con nadie.',
      variables: [{ key: '{{1}}', example: '482913' }],
      localStatus: 'active',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 25),
      updatedAt: daysAgo(now, 24),
      lastSyncedAt: daysAgo(now, 24),
    },

    // ── Borrador nuevo (nunca enviado) ────────────────────────────────────
    {
      id: 'tpl_bienvenida_borrador',
      workspaceId: WORKSPACE_ID,
      name: 'bienvenida_nuevos',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, ¡gracias por sumarte! Te dejamos un 10% para tu primera compra: {{2}}.',
      variables: [
        { key: '{{1}}', example: 'Camila' },
        { key: '{{2}}', example: 'BIENVENIDA10' },
      ],
      localStatus: 'draft',
      remoteStatus: null,
      syncStatus: 'never_synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: hoursAgo(now, 6),
      updatedAt: hoursAgo(now, 4),
      lastSyncedAt: null,
    },

    // ── En revisión (enviada a Meta, pendiente) ───────────────────────────
    {
      id: 'tpl_encuesta_satisfaccion',
      workspaceId: WORKSPACE_ID,
      name: 'encuesta_satisfaccion',
      category: 'utility',
      language: 'es_AR',
      body: 'Hola {{1}}, ¿cómo calificarías tu última experiencia con nosotros del 1 al 5?',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'pending',
      syncStatus: 'pending_sync',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 2),
      updatedAt: daysAgo(now, 1),
      lastSyncedAt: daysAgo(now, 1),
    },

    // ── Rechazada (con motivo) ────────────────────────────────────────────
    {
      id: 'tpl_descuento_black',
      workspaceId: WORKSPACE_ID,
      name: 'descuento_black_friday',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, aprovechá el Black Friday con hasta 50% off en todo el sitio.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'rejected',
      syncStatus: 'synced',
      rejectionReason:
        'El contenido promocional no cumple con la política de plantillas de la categoría seleccionada.',
      previousLocalStatus: null,
      createdAt: daysAgo(now, 12),
      updatedAt: daysAgo(now, 10),
      lastSyncedAt: daysAgo(now, 10),
    },

    // ── Pausada por Meta ──────────────────────────────────────────────────
    {
      id: 'tpl_promo_pausada',
      workspaceId: WORKSPACE_ID,
      name: 'promo_flash',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, oferta flash por hoy: envío gratis en toda la tienda. ¿Aprovechás?',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'paused',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 20),
      updatedAt: daysAgo(now, 5),
      lastSyncedAt: daysAgo(now, 5),
    },

    // ── Deshabilitada localmente (Meta la mantiene aprobada) ──────────────
    {
      id: 'tpl_aviso_horarios',
      workspaceId: WORKSPACE_ID,
      name: 'aviso_horarios',
      category: 'utility',
      language: 'es_AR',
      body: 'Hola {{1}}, te informamos nuestros nuevos horarios de atención: {{2}}.',
      variables: [
        { key: '{{1}}', example: 'Camila' },
        { key: '{{2}}', example: 'Lunes a viernes de 9 a 18' },
      ],
      localStatus: 'disabled',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      // previousLocalStatus solo tiene valor en plantillas deleted (lo setea DELETE).
      previousLocalStatus: null,
      createdAt: daysAgo(now, 22),
      updatedAt: daysAgo(now, 3),
      lastSyncedAt: daysAgo(now, 18),
    },

    // ── Aprobada pero sin sincronizar (solo seed / reconciliación real) ────
    {
      id: 'tpl_recordatorio_desync',
      workspaceId: WORKSPACE_ID,
      name: 'recordatorio_pago',
      category: 'utility',
      language: 'es_AR',
      body: 'Hola {{1}}, tenés un pago pendiente de {{2}}. Podés regularizarlo desde tu cuenta.',
      variables: [
        { key: '{{1}}', example: 'Camila' },
        { key: '{{2}}', example: '$ 15.000' },
      ],
      localStatus: 'active',
      remoteStatus: 'approved',
      syncStatus: 'out_of_sync',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 26),
      updatedAt: daysAgo(now, 2),
      lastSyncedAt: daysAgo(now, 15),
    },

    // ── Archivada en Meta ─────────────────────────────────────────────────
    {
      id: 'tpl_catalogo_archivado',
      workspaceId: WORKSPACE_ID,
      name: 'catalogo_temporada',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, ya está disponible el catálogo de esta temporada. ¿Te lo enviamos?',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'archived',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 60),
      updatedAt: daysAgo(now, 45),
      lastSyncedAt: daysAgo(now, 45),
    },

    // ── Estado remoto no reconocido (fallback 'unknown') ──────────────────
    {
      id: 'tpl_estado_desconocido',
      workspaceId: WORKSPACE_ID,
      name: 'promo_experimental',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, sumate a nuestro programa de beneficios y accedé a descuentos exclusivos.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'unknown',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 15),
      updatedAt: daysAgo(now, 8),
      lastSyncedAt: daysAgo(now, 8),
    },

    // ── Deshabilitada por Meta (remoto) — distinta de disabled local ──────
    {
      id: 'tpl_aviso_pago_meta_off',
      workspaceId: WORKSPACE_ID,
      name: 'aviso_pago',
      category: 'utility',
      language: 'es_AR',
      body: 'Hola {{1}}, registramos tu pago de {{2}}. ¡Gracias!',
      variables: [
        { key: '{{1}}', example: 'Camila' },
        { key: '{{2}}', example: '$ 8.500' },
      ],
      localStatus: 'active',
      remoteStatus: 'disabled',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 34),
      updatedAt: daysAgo(now, 6),
      lastSyncedAt: daysAgo(now, 6),
    },

    // ── En apelación (remoto) ─────────────────────────────────────────────
    {
      id: 'tpl_promo_apelacion',
      workspaceId: WORKSPACE_ID,
      name: 'promo_apelacion',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, tenemos una propuesta especial para vos esta semana.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'in_appeal',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 18),
      updatedAt: daysAgo(now, 4),
      lastSyncedAt: daysAgo(now, 4),
    },

    // ── Baja pendiente (remoto) ───────────────────────────────────────────
    {
      id: 'tpl_promo_baja',
      workspaceId: WORKSPACE_ID,
      name: 'promo_temporada_baja',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, cerramos la temporada con descuentos finales.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'pending_deletion',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 55),
      updatedAt: daysAgo(now, 7),
      lastSyncedAt: daysAgo(now, 7),
    },

    // ── Límite excedido (remoto) ──────────────────────────────────────────
    {
      id: 'tpl_promo_limite',
      workspaceId: WORKSPACE_ID,
      name: 'promo_masiva',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, sumate a la promo del mes y ahorrá en tu próxima compra.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'limit_exceeded',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 28),
      updatedAt: daysAgo(now, 5),
      lastSyncedAt: daysAgo(now, 5),
    },

    // ── Eliminada en Meta (remoto) — distinta de deleted local ────────────
    {
      id: 'tpl_promo_meta_borrada',
      workspaceId: WORKSPACE_ID,
      name: 'promo_antigua',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, gracias por tu preferencia durante todo el año.',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'active',
      remoteStatus: 'deleted',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: null,
      createdAt: daysAgo(now, 70),
      updatedAt: daysAgo(now, 12),
      lastSyncedAt: daysAgo(now, 12),
    },

    // ── Eliminada localmente (papelera) ───────────────────────────────────
    {
      id: 'tpl_promo_junio_eliminada',
      workspaceId: WORKSPACE_ID,
      name: 'promo_junio',
      category: 'marketing',
      language: 'es_AR',
      body: 'Hola {{1}}, cerramos junio con 3x2 en toda la tienda. ¡Últimos días!',
      variables: [{ key: '{{1}}', example: 'Camila' }],
      localStatus: 'deleted',
      remoteStatus: 'approved',
      syncStatus: 'synced',
      rejectionReason: null,
      previousLocalStatus: 'active',
      createdAt: daysAgo(now, 50),
      updatedAt: daysAgo(now, 9),
      lastSyncedAt: daysAgo(now, 40),
    },
  ];
}
