import type { Campaign } from '@/types';

/**
 * Descripción semántica de la fecha de una campaña para la lista.
 *
 * Función pura: depende únicamente de `status`, `createdAt` y `scheduledAt`.
 * No consulta `Date.now()`, no infiere una fecha de envío y no renderiza.
 *
 * El modelo actual solo tiene dos timestamps reales: `createdAt` y
 * `scheduledAt`. `scheduledAt` es el momento *programado*, no el momento en que
 * el envío terminó o falló. Por eso los estados terminales (completed/failed/
 * cancelled) muestran honestamente "Creada · <createdAt>" en lugar de afirmar
 * una fecha de envío que el modelo no registra.
 *
 * Integración real (Iteración 5 / backend): agregar timestamps explícitos
 * `sentAt`, `failedAt`, `cancelledAt` (y posiblemente `updatedAt`) y migrar las
 * ramas terminales de esta función a esos campos.
 */
export interface CampaignDateLabel {
  /** Texto que antecede a la fecha, ya con su separador ("Creada ·"). */
  prefix: string;
  /** ISO a formatear en el render. */
  iso: string;
  /** true solo para la campaña programada: es el único evento pendiente. */
  emphasis: boolean;
}

export function campaignDateLabel(campaign: Campaign): CampaignDateLabel {
  if (campaign.status === 'scheduled' && campaign.scheduledAt) {
    return { prefix: 'Programada para', iso: campaign.scheduledAt, emphasis: true };
  }
  // draft, completed, failed, cancelled — y scheduled sin fecha (defensivo):
  // solo createdAt es un hecho verificable en el modelo actual.
  return { prefix: 'Creada ·', iso: campaign.createdAt, emphasis: false };
}
