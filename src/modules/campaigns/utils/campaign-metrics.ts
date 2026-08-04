import type { Campaign, CampaignMetrics, CampaignStatus } from '@/types';

/** Estados sin envío: todas las métricas de actividad van en cero. */
const ZERO_ACTIVITY: ReadonlySet<CampaignStatus> = new Set([
  'draft',
  'scheduled',
  'cancelled',
]);

/**
 * Métricas de una campaña recién creada o editada.
 *
 * Solo draft y scheduled se crean desde el wizard, así que la actividad siempre
 * es cero. Se centraliza para que se cumpla la invariante recipients = sent +
 * failed sin repetir literales por todos lados.
 */
export function initialMetrics(recipientCount: number): CampaignMetrics {
  return { recipients: recipientCount, sent: 0, delivered: 0, read: 0, failed: 0 };
}

/**
 * Verifica las invariantes de métricas. No corre en producción; existe para las
 * pruebas y como documentación ejecutable del contrato.
 */
export function metricsAreConsistent(campaign: Campaign): boolean {
  const { recipients, sent, delivered, read, failed } = campaign.metrics;
  if ([recipients, sent, delivered, read, failed].some((n) => n < 0)) return false;
  if (delivered > sent) return false;
  if (read > delivered) return false;

  // En estados sin envío recipients es solo el tamaño de audiencia; la actividad
  // es cero. La invariante recipients = sent + failed vale recién cuando cada
  // destinatario terminó como enviado o fallido, es decir en campañas enviadas.
  if (ZERO_ACTIVITY.has(campaign.status)) {
    return sent === 0 && delivered === 0 && read === 0 && failed === 0;
  }
  return recipients === sent + failed;
}
