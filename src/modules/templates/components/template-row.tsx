'use client';

import Link from 'next/link';
import { Braces, CalendarDays } from 'lucide-react';
import { formatDateTimeLong } from '@/lib/format';
import type { WhatsAppTemplate } from '@/types';
import { CATEGORY_LABEL } from '../utils/template-filters';
import { TemplateStatusBadge } from './template-status-badge';
import { SyncChip } from './sync-chip';

/**
 * Fila rica de escritorio/tablet. Muestra la fecha de creación de forma honesta:
 * no inventa fecha de aprobación/rechazo/pausa; createdAt es un hecho del modelo.
 */
export function TemplateRow({ template }: { template: WhatsAppTemplate }) {
  return (
    <Link
      href={`/plantillas/${template.id}`}
      className="flex items-center gap-4 border-b border-border px-4 py-3.5 transition-colors hover:bg-secondary/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[15px] font-medium text-foreground">{template.name}</span>
          <TemplateStatusBadge template={template} />
          <SyncChip template={template} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          <span>{CATEGORY_LABEL[template.category]}</span>
          {/* El idioma se oculta primero en tablet estrecho para no comprimir. */}
          <span className="hidden sm:inline">{template.language}</span>
          <span className="flex items-center gap-1">
            <Braces className="size-3" />
            {template.variables.length}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            Creada · {formatDateTimeLong(template.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
