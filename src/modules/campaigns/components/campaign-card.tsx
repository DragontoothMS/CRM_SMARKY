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

/** Card de móvil: evita filas horizontales con scroll. */
export function CampaignCard({
  campaign,
  template,
}: {
  campaign: Campaign;
  template?: WhatsAppTemplate;
}) {
  const dateLabel = campaignDateLabel(campaign);

  return (
    <Link
      href={`/campanas/${campaign.id}`}
      className="block space-y-2 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1 text-[15px] font-medium text-foreground">
          {campaign.name}
        </span>
        <CampaignStatusBadge status={campaign.status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="truncate">{template?.name ?? 'Plantilla eliminada'}</span>
        <span className="flex items-center gap-1">
          <Users className="size-3" />
          {campaign.recipientIds.length} destinatarios
        </span>
        <span className={cn(dateLabel.emphasis && 'font-medium text-foreground')}>
          {dateLabel.prefix} {formatDateTimeLong(dateLabel.iso)}
        </span>
      </div>

      {HAS_ACTIVITY.has(campaign.status) && (
        <MetricsBar metrics={campaign.metrics} className="border-t border-border pt-2" />
      )}
    </Link>
  );
}
