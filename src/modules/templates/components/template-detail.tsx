'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Braces,
  CalendarDays,
  Eye,
  FileText,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelSection } from '@/modules/inbox/components/contact-panel/panel-section';
import { formatDateTimeLong } from '@/lib/format';
import type { WhatsAppTemplate } from '@/types';
import { isRejected, presentedStatus } from '../utils/template-status';
import { CATEGORY_LABEL } from '../utils/template-filters';
import { TemplateStatusBadge } from './template-status-badge';
import { SyncChip } from './sync-chip';
import { TemplatePreview } from './template-preview';
import { TemplateActionsBar } from './template-actions-bar';

export function TemplateDetail({ template }: { template: WhatsAppTemplate }) {
  const rejected = isRejected(template);
  const isUnknown = presentedStatus(template) === 'unknown';

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          nativeButton={false}
          render={<Link href="/plantillas" />}
        >
          <ArrowLeft className="size-[18px]" />
          <span className="sr-only">Volver a plantillas</span>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-base font-semibold text-foreground">{template.name}</h1>
            <TemplateStatusBadge template={template} />
            <SyncChip template={template} />
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <TemplateActionsBar template={template} />

        {isUnknown && (
          <div className="mx-4 mt-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
            <p className="text-xs text-amber-900">
              Esta plantilla está en un estado que no podemos interpretar con claridad. No puede
              usarse en campañas hasta que se resuelva.
            </p>
          </div>
        )}

        <PanelSection title="Contenido" icon={FileText}>
          <p className="rounded-lg border border-border bg-surface p-3 text-sm break-words whitespace-pre-wrap text-foreground">
            {template.body}
          </p>
        </PanelSection>

        <PanelSection title="Vista previa" icon={Eye}>
          <TemplatePreview template={template} />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Con los valores de ejemplo de cada variable.
          </p>
        </PanelSection>

        <PanelSection title={`Variables · ${template.variables.length}`} icon={Braces}>
          {template.variables.length === 0 ? (
            <p className="text-xs text-muted-foreground">Esta plantilla no tiene variables.</p>
          ) : (
            <ul className="divide-y divide-border">
              {template.variables.map((variable) => (
                <li key={variable.key} className="flex items-center justify-between gap-2 py-2">
                  <span className="font-mono text-xs text-muted-foreground">{variable.key}</span>
                  <span className="min-w-0 truncate text-sm text-foreground">
                    {variable.example.trim() ? variable.example : '— sin ejemplo'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelSection>

        {rejected && (
          <PanelSection title="Motivo de rechazo" icon={AlertTriangle}>
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              {template.rejectionReason ?? 'Sin detalle disponible.'}
            </p>
          </PanelSection>
        )}

        <PanelSection title="Detalles" icon={Info}>
          <dl className="space-y-2.5">
            <Row icon={FileText} label="Categoría" value={CATEGORY_LABEL[template.category]} />
            <Row icon={Info} label="Idioma" value={template.language} />
            <Row icon={CalendarDays} label="Creada" value={formatDateTimeLong(template.createdAt)} />
            <Row
              icon={CalendarDays}
              label="Última modificación"
              value={formatDateTimeLong(template.updatedAt)}
            />
            {template.lastSyncedAt && (
              <Row
                icon={RefreshCw}
                label="Sincronizada"
                value={formatDateTimeLong(template.lastSyncedAt)}
              />
            )}
          </dl>
        </PanelSection>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}
