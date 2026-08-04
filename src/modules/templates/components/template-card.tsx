'use client';

import Link from 'next/link';
import { Braces, CalendarDays } from 'lucide-react';
import { formatDateTimeLong } from '@/lib/format';
import type { WhatsAppTemplate } from '@/types';
import { CATEGORY_LABEL } from '../utils/template-filters';
import { TemplateStatusBadge } from './template-status-badge';
import { SyncChip } from './sync-chip';

/** Card de móvil: nombre y estado con máxima prioridad, sin preview. */
export function TemplateCard({ template }: { template: WhatsAppTemplate }) {
  return (
    <Link
      href={`/plantillas/${template.id}`}
      className="block space-y-2 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1 text-[15px] font-medium break-words text-foreground">{template.name}</span>
        <TemplateStatusBadge template={template} />
      </div>
      <SyncChip template={template} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{CATEGORY_LABEL[template.category]}</span>
        <span>{template.language}</span>
        <span className="flex items-center gap-1">
          <Braces className="size-3" />
          {template.variables.length} variables
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3" />
          Creada · {formatDateTimeLong(template.createdAt)}
        </span>
      </div>
    </Link>
  );
}
