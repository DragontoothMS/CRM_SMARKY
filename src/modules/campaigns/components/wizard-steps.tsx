'use client';

import { AlertCircle, Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CHANNEL_META } from '@/lib/channels';
import { formatDateTimeLong } from '@/lib/format';
import type {
  Contact,
  PipelineStage,
  Tag,
  WhatsAppTemplate,
} from '@/types';
import type { RecipientCandidate } from '../utils/eligible-recipients';
import { summarizeCandidates } from '../utils/eligible-recipients';
import { renderTemplateBody } from '../utils/render-template';
import type { WizardState } from '../hooks/use-campaign-wizard';
import { CampaignStatusBadge } from './campaign-status-badge';

// ---- Paso 1: información básica ----
export function StepInfo({
  wizard,
  patch,
}: {
  wizard: WizardState;
  patch: (p: Partial<WizardState>) => void;
}) {
  return (
    <Field label="Nombre de la campaña" hint="Solo lo ves vos; identifica la campaña en la lista.">
      <Input
        autoFocus
        value={wizard.name}
        onChange={(event) => patch({ name: event.target.value })}
        placeholder="Ej: Promo verano · catálogo nuevo"
        className="h-10 bg-surface"
      />
    </Field>
  );
}

// ---- Paso 2: seleccionar plantilla (solo approved) ----
export function StepTemplate({
  templates,
  selectedId,
  onSelect,
}: {
  templates: WhatsAppTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (templates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay plantillas aprobadas disponibles. Se gestionarán en el módulo Plantillas.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Solo se muestran plantillas aprobadas por Meta.
      </p>
      {templates.map((template) => {
        const active = selectedId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              'w-full space-y-1.5 rounded-lg border p-3 text-left transition-colors',
              active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{template.name}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {template.category}
              </span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {template.language}
              </span>
              {active && <Check className="ml-auto size-4 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">{template.body}</p>
          </button>
        );
      })}
    </div>
  );
}

// ---- Paso 3: audiencia ----
export function StepAudience({
  wizard,
  patch,
  candidates,
  recipientCount,
  tags,
  stages,
}: {
  wizard: WizardState;
  patch: (p: Partial<WizardState>) => void;
  candidates: RecipientCandidate[];
  /** Destinatarios reales que se guardarán (en manual, la selección elegible). */
  recipientCount: number;
  tags: Tag[];
  stages: PipelineStage[];
}) {
  const summary = summarizeCandidates(candidates);
  const type = wizard.audience.type;

  const toggleManual = (contactId: string) => {
    const selected = new Set(wizard.manualSelection);
    if (selected.has(contactId)) selected.delete(contactId);
    else selected.add(contactId);
    patch({ manualSelection: [...selected] });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ['all', 'Todos'],
            ['tag', 'Por etiqueta'],
            ['stage', 'Por etapa'],
            ['manual', 'Manual'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => patch({ audience: { type: value } })}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              type === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {type === 'tag' && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => patch({ audience: { type: 'tag', tagId: tag.id } })}
              className={cn(
                'rounded-md border px-2 py-1 text-xs transition-colors',
                wizard.audience.tagId === tag.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {type === 'stage' && (
        <div className="flex flex-wrap gap-1.5">
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => patch({ audience: { type: 'stage', stageId: stage.id } })}
              className={cn(
                'rounded-md border px-2 py-1 text-xs transition-colors',
                wizard.audience.stageId === stage.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {stage.name}
            </button>
          ))}
        </div>
      )}

      {/* Incluidos vs excluidos: siempre visible, con el motivo de exclusión. */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Users className="size-4 text-primary" />
          {recipientCount} {recipientCount === 1 ? 'destinatario' : 'destinatarios'}
        </span>
        {summary.excluded > 0 && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <AlertCircle className="size-4 text-warning" />
            {summary.excluded} sin WhatsApp
          </span>
        )}
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {candidates.map(({ contact, eligible, reason }) => {
          const meta = CHANNEL_META[contact.channelIdentities[0]?.channel ?? 'whatsapp'];
          const selectable = type === 'manual' && eligible;
          const checked = type === 'manual' ? wizard.manualSelection.includes(contact.id) : eligible;
          return (
            <li
              key={contact.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2',
                !eligible && 'opacity-55',
                selectable && 'cursor-pointer hover:bg-secondary/60',
              )}
              onClick={selectable ? () => toggleManual(contact.id) : undefined}
            >
              {type === 'manual' && (
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded border',
                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                    !eligible && 'border-border bg-secondary',
                  )}
                >
                  {checked && <Check className="size-3" />}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{contact.name}</span>
              {eligible ? (
                <span className="shrink-0 text-xs text-muted-foreground">{meta.label}</span>
              ) : (
                <span className="shrink-0 text-xs text-warning">{reason}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---- Paso 4: variables ----
export function StepVariables({
  wizard,
  patch,
  template,
  sampleContact,
}: {
  wizard: WizardState;
  patch: (p: Partial<WizardState>) => void;
  template: WhatsAppTemplate | null;
  sampleContact: Contact | null;
}) {
  if (!template) return null;
  if (template.variables.length === 0) {
    return <p className="text-sm text-muted-foreground">Esta plantilla no tiene variables.</p>;
  }

  const setMapping = (
    key: string,
    mapping: { source: 'fixed'; value: string } | { source: 'contact_name' },
  ) => patch({ variableMappings: { ...wizard.variableMappings, [key]: mapping } });

  return (
    <div className="space-y-4">
      {template.variables.map((variable) => {
        const mapping = wizard.variableMappings[variable.key];
        const isName = mapping?.source === 'contact_name';
        return (
          <div key={variable.key} className="space-y-2 rounded-lg border border-border p-3">
            <p className="text-sm font-medium text-foreground">
              Variable {variable.key}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                (ej: {variable.example})
              </span>
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setMapping(variable.key, { source: 'contact_name' })}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  isName
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                Nombre del contacto
              </button>
              <button
                type="button"
                onClick={() =>
                  setMapping(variable.key, {
                    source: 'fixed',
                    value: mapping?.source === 'fixed' ? mapping.value : '',
                  })
                }
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  mapping?.source === 'fixed'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                Valor fijo
              </button>
            </div>
            {mapping?.source === 'fixed' && (
              <Input
                value={mapping.value}
                onChange={(event) =>
                  setMapping(variable.key, { source: 'fixed', value: event.target.value })
                }
                placeholder="Escribí el valor para todos los destinatarios"
                className="h-9 bg-surface"
              />
            )}
          </div>
        );
      })}

      <div className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Vista previa
        </p>
        <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm whitespace-pre-wrap text-foreground">
          {renderTemplateBody(template, wizard.variableMappings, sampleContact)}
        </p>
        {sampleContact && (
          <p className="text-[11px] text-muted-foreground">Ejemplo con {sampleContact.name}</p>
        )}
      </div>
    </div>
  );
}

// ---- Paso 5: programación ----
export function StepSchedule({
  wizard,
  patch,
  minDateTime,
}: {
  wizard: WizardState;
  patch: (p: Partial<WizardState>) => void;
  minDateTime: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {(
          [
            ['draft', 'Guardar como borrador'],
            ['scheduled', 'Programar envío'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => patch({ scheduleMode: value })}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              wizard.scheduleMode === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {wizard.scheduleMode === 'scheduled' && (
        <Field label="Fecha y hora de envío" hint="No se realiza ningún envío real en la demo.">
          <Input
            type="datetime-local"
            min={minDateTime}
            value={wizard.scheduledAt}
            onChange={(event) => patch({ scheduledAt: event.target.value })}
            className="h-10 bg-surface"
          />
        </Field>
      )}

      {wizard.scheduleMode === 'draft' && (
        <p className="text-sm text-muted-foreground">
          La campaña se guardará como borrador y podrás programarla o editarla más tarde.
        </p>
      )}
    </div>
  );
}

// ---- Paso 6: confirmación ----
export function StepConfirm({
  wizard,
  template,
  recipientCount,
}: {
  wizard: WizardState;
  template: WhatsAppTemplate | null;
  recipientCount: number;
}) {
  return (
    <div className="space-y-3">
      <Summary label="Nombre" value={wizard.name} />
      <Summary label="Plantilla" value={template?.name ?? '—'} />
      <Summary label="Destinatarios" value={`${recipientCount} contactos con WhatsApp`} />
      <div className="flex items-center justify-between gap-2 border-b border-border py-2">
        <span className="text-xs text-muted-foreground">Estado</span>
        <CampaignStatusBadge status={wizard.scheduleMode} />
      </div>
      {wizard.scheduleMode === 'scheduled' && (
        <Summary
          label="Programada para"
          value={wizard.scheduledAt ? formatDateTimeLong(wizard.scheduledAt) : '—'}
        />
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
