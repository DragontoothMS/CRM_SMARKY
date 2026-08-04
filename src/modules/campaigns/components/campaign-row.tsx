'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTimeLong } from '@/lib/format';
import type { Campaign, WhatsAppTemplate } from '@/types';
import { campaignDateLabel } from '../utils/campaign-date-label';
import { CampaignStatusBadge } from './campaign-status-badge';
import { MetricsBar } from './metrics-bar';

const HAS_ACTIVITY = new Set(['completed', 'failed']);

/**
 * Fila rica de escritorio/tablet: no una tabla densa. La barra de métricas solo
 * aparece en campañas enviadas; el resto muestra su fecha programada o "Borrador".
 */
export function CampaignRow({
  campaign,
  template,
}: {
  campaign: Campaign;
  template?: WhatsAppTemplate;
}) {
  const showMetrics = HAS_ACTIVITY.has(campaign.status);
  const dateLabel = campaignDateLabel(campaign);

  return (
    <Link
      href={`/campanas/${campaign.id}`}
      className="flex items-center gap-4 border-b border-border px-4 py-3.5 transition-colors hover:bg-secondary/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[15px] font-medium text-foreground">{campaign.name}</span>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          <span className="truncate">{template?.name ?? 'Plantilla eliminada'}</span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {campaign.recipientIds.length}
          </span>
          <span
            className={cn(dateLabel.emphasis && 'font-medium text-foreground')}
          >
            {dateLabel.prefix} {formatDateTimeLong(dateLabel.iso)}
          </span>
          {/* Indicador compacto de envío: solo <lg (arriba de lg ya está MetricsBar). */}
          {showMetrics && (
            <span className="font-medium text-foreground tabular-nums lg:hidden">
              {campaign.metrics.sent}/{campaign.metrics.recipients} enviados
            </span>
          )}
        </div>
      </div>

      {/* Métricas ocultas en tablet estrecho para no comprimir; visibles en desktop. */}
      {showMetrics && <MetricsBar metrics={campaign.metrics} className="hidden shrink-0 lg:flex" />}
    </Link>
  );
}
