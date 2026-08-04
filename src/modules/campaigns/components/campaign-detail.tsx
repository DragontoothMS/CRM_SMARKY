'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  CalendarDays,
  FileText,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelSection } from '@/modules/inbox/components/contact-panel/panel-section';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { formatDateTimeLong } from '@/lib/format';
import { CURRENT_USER } from '@/mocks';
import type { Campaign } from '@/types';
import { campaignRecipients } from '../utils/eligible-recipients';
import { renderTemplateBody } from '../utils/render-template';
import { CampaignStatusBadge } from './campaign-status-badge';
import { MetricsBar } from './metrics-bar';

const HAS_ACTIVITY = new Set(['completed', 'failed']);

export function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const { state, dispatch } = useWorkspace();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const template = state?.templates[campaign.templateId];
  const recipients = state ? campaignRecipients(campaign, state.contacts) : [];
  const sample = recipients[0] ?? null;
  const preview = template ? renderTemplateBody(template, campaign.variableMappings, sample) : '';

  const canCancel = campaign.status === 'scheduled';

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          nativeButton={false}
          render={<Link href="/campanas" />}
        >
          <ArrowLeft className="size-[18px]" />
          <span className="sr-only">Volver a campañas</span>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold text-foreground">{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
        </div>
        {canCancel &&
          (confirmingCancel ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={() => dispatch({ type: 'CANCEL_CAMPAIGN', campaignId: campaign.id })}
              >
                Confirmar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setConfirmingCancel(false)}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setConfirmingCancel(true)}
            >
              <Ban className="size-3.5" />
              Cancelar campaña
            </Button>
          ))}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {HAS_ACTIVITY.has(campaign.status) && (
          <PanelSection title="Resultados" icon={Users}>
            <MetricsBar metrics={campaign.metrics} />
          </PanelSection>
        )}

        <PanelSection title="Plantilla" icon={FileText}>
          {template ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{template.name}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5">{template.category}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5">{template.language}</span>
              </div>
              <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm whitespace-pre-wrap text-foreground">
                {preview}
              </p>
              {sample && (
                <p className="text-[11px] text-muted-foreground">
                  Vista previa para {sample.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">La plantilla ya no está disponible.</p>
          )}
        </PanelSection>

        <PanelSection title="Programación" icon={CalendarClock}>
          <dl className="space-y-2.5">
            <Row
              icon={CalendarDays}
              label="Creada"
              value={`${formatDateTimeLong(campaign.createdAt)} · ${CURRENT_USER.name}`}
            />
            <Row
              icon={CalendarClock}
              label={campaign.status === 'scheduled' ? 'Programada para' : 'Envío'}
              value={
                campaign.scheduledAt
                  ? formatDateTimeLong(campaign.scheduledAt)
                  : campaign.status === 'draft'
                    ? 'Sin programar (borrador)'
                    : '—'
              }
            />
          </dl>
        </PanelSection>

        <PanelSection title={`Destinatarios · ${recipients.length}`} icon={Users}>
          {recipients.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sin destinatarios.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recipients.map((contact) => {
                const identity = contact.channelIdentities.find((i) => i.channel === 'whatsapp');
                return (
                  <li key={contact.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="truncate text-sm text-foreground">{contact.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {identity?.displayValue}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
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
