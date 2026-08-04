'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { useCampaignsView } from '../hooks/use-campaigns-view';
import { useCampaignWizard, WIZARD_STEPS } from '../hooks/use-campaign-wizard';
import { CampaignsSkeleton } from './campaigns-skeleton';
import {
  StepAudience,
  StepConfirm,
  StepInfo,
  StepSchedule,
  StepTemplate,
  StepVariables,
} from './wizard-steps';

/** datetime-local exige "YYYY-MM-DDTHH:mm"; recorto el ISO del seed. */
function toLocalInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16);
}

export function CampaignWizard() {
  const router = useRouter();
  const { dispatch } = useWorkspace();
  const view = useCampaignsView();
  const wiz = useCampaignWizard(view?.contacts ?? [], view?.approvedTemplates ?? []);

  if (!view) return <CampaignsSkeleton />;

  const { step, setStep, wizard, patch, template, candidates, recipientIds, sampleContact, canProceed, isLast } =
    wiz;

  function confirm() {
    if (!template) return;
    const id = `camp_${Date.now().toString(36)}`;
    dispatch({
      type: 'CREATE_CAMPAIGN',
      payload: {
        id,
        name: wizard.name.trim(),
        templateId: template.id,
        audience: wizard.audience,
        recipientIds,
        variableMappings: wizard.variableMappings,
        status: wizard.scheduleMode,
        scheduledAt:
          wizard.scheduleMode === 'scheduled' && wizard.scheduledAt
            ? new Date(wizard.scheduledAt).toISOString()
            : null,
        createdAt: new Date().toISOString(),
      },
    });
    router.push(`/campanas/${id}`);
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col">
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
        <h1 className="text-base font-semibold text-foreground">Nueva campaña</h1>
      </header>

      {/* Stepper */}
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-4 py-2.5">
        {WIZARD_STEPS.map((label, index) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                index < step && 'bg-primary text-primary-foreground',
                index === step && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                index > step && 'bg-secondary text-muted-foreground',
              )}
            >
              {index < step ? <Check className="size-3" /> : index + 1}
            </span>
            <span
              className={cn(
                'text-xs whitespace-nowrap',
                index === step ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
            {index < WIZARD_STEPS.length - 1 && <span className="mx-1 text-muted-foreground">·</span>}
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {step === 0 && <StepInfo wizard={wizard} patch={patch} />}
        {step === 1 && (
          <StepTemplate
            templates={view.approvedTemplates}
            selectedId={wizard.templateId}
            onSelect={(id) => patch({ templateId: id })}
          />
        )}
        {step === 2 && (
          <StepAudience
            wizard={wizard}
            patch={patch}
            candidates={candidates}
            recipientCount={recipientIds.length}
            tags={view.tags}
            stages={view.stages}
          />
        )}
        {step === 3 && (
          <StepVariables
            wizard={wizard}
            patch={patch}
            template={template}
            sampleContact={sampleContact}
          />
        )}
        {step === 4 && (
          <StepSchedule wizard={wizard} patch={patch} minDateTime={toLocalInput(view.seededAt)} />
        )}
        {step === 5 && (
          <StepConfirm wizard={wizard} template={template} recipientCount={recipientIds.length} />
        )}
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          <ArrowLeft className="size-4" />
          Atrás
        </Button>
        {isLast ? (
          <Button size="sm" className="h-9" onClick={confirm}>
            <Check className="size-4" />
            {wizard.scheduleMode === 'scheduled' ? 'Programar campaña' : 'Guardar borrador'}
          </Button>
        ) : (
          <Button size="sm" className="h-9" disabled={!canProceed} onClick={() => setStep(step + 1)}>
            Siguiente
            <ArrowRight className="size-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
