import type { Campaign } from '@/types';
import { CURRENT_USER } from './current-user';
import { WORKSPACE_ID } from './seed-base';
import { daysAgo, hoursAgo } from './seed-helpers';

/** Los 5 contactos con identidad de WhatsApp; los únicos elegibles. */
const WA_RECIPIENTS = ['ct_wa_01', 'ct_wa_02', 'ct_wa_03', 'ct_wa_04', 'ct_wa_05'];

/**
 * Campañas demo, una por estado del MVP: draft, scheduled, completed, failed,
 * cancelled. Las métricas cumplen recipients = sent + failed, delivered ≤ sent,
 * read ≤ delivered; draft/scheduled/cancelled van en cero.
 */
export function createCampaigns(now: Date): Campaign[] {
  return [
    {
      id: 'camp_promo_verano',
      workspaceId: WORKSPACE_ID,
      name: 'Promo verano · catálogo nuevo',
      status: 'completed',
      templateId: 'tpl_promo_lanzamiento',
      audience: { type: 'all' },
      recipientIds: WA_RECIPIENTS,
      variableMappings: { '{{1}}': { source: 'contact_name' } },
      createdAt: daysAgo(now, 6),
      scheduledAt: daysAgo(now, 5),
      createdBy: CURRENT_USER.id,
      metrics: { recipients: 5, sent: 5, delivered: 5, read: 4, failed: 0 },
    },
    {
      id: 'camp_recordatorio_turnos',
      workspaceId: WORKSPACE_ID,
      name: 'Recordatorio de turnos',
      status: 'completed',
      templateId: 'tpl_recordatorio_turno',
      audience: { type: 'tag', tagId: 'tag_calificado' },
      recipientIds: ['ct_wa_01', 'ct_wa_02', 'ct_wa_03'],
      variableMappings: {
        '{{1}}': { source: 'contact_name' },
        '{{2}}': { source: 'fixed', value: '12 de agosto a las 15:00' },
      },
      createdAt: daysAgo(now, 3),
      scheduledAt: daysAgo(now, 2),
      createdBy: CURRENT_USER.id,
      // Un entregado que no llegó a leerse y uno fallido: recipients = sent + failed.
      metrics: { recipients: 3, sent: 2, delivered: 2, read: 1, failed: 1 },
    },
    {
      id: 'camp_reactivacion_agosto',
      workspaceId: WORKSPACE_ID,
      name: 'Reactivación · clientes inactivos',
      status: 'scheduled',
      templateId: 'tpl_reactivacion',
      audience: { type: 'stage', stageId: 'stage_perdido' },
      recipientIds: ['ct_wa_04'],
      variableMappings: { '{{1}}': { source: 'contact_name' } },
      createdAt: hoursAgo(now, 20),
      scheduledAt: daysAgo(now, -2), // dentro de 2 días
      createdBy: CURRENT_USER.id,
      metrics: { recipients: 1, sent: 0, delivered: 0, read: 0, failed: 0 },
    },
    {
      id: 'camp_borrador_mayoristas',
      workspaceId: WORKSPACE_ID,
      name: 'Borrador · mayoristas',
      status: 'draft',
      templateId: 'tpl_promo_lanzamiento',
      audience: { type: 'tag', tagId: 'tag_mayorista' },
      recipientIds: ['ct_wa_02'],
      variableMappings: { '{{1}}': { source: 'contact_name' } },
      createdAt: hoursAgo(now, 5),
      scheduledAt: null,
      createdBy: CURRENT_USER.id,
      metrics: { recipients: 1, sent: 0, delivered: 0, read: 0, failed: 0 },
    },
    {
      id: 'camp_encuesta_fallida',
      workspaceId: WORKSPACE_ID,
      name: 'Encuesta de satisfacción',
      status: 'failed',
      templateId: 'tpl_recordatorio_turno',
      audience: { type: 'all' },
      recipientIds: WA_RECIPIENTS,
      variableMappings: {
        '{{1}}': { source: 'contact_name' },
        '{{2}}': { source: 'fixed', value: 'esta semana' },
      },
      createdAt: daysAgo(now, 8),
      scheduledAt: daysAgo(now, 7),
      createdBy: CURRENT_USER.id,
      // Falló el envío completo: nada llegó, todo a failed.
      metrics: { recipients: 5, sent: 0, delivered: 0, read: 0, failed: 5 },
    },
    {
      id: 'camp_cancelada_junio',
      workspaceId: WORKSPACE_ID,
      name: 'Cancelada · promo junio',
      status: 'cancelled',
      templateId: 'tpl_reactivacion',
      audience: { type: 'all' },
      recipientIds: WA_RECIPIENTS,
      variableMappings: { '{{1}}': { source: 'contact_name' } },
      createdAt: daysAgo(now, 10),
      scheduledAt: null,
      createdBy: CURRENT_USER.id,
      metrics: { recipients: 5, sent: 0, delivered: 0, read: 0, failed: 0 },
    },
  ];
}
