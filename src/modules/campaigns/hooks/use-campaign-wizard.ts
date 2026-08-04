'use client';

import { useMemo, useState } from 'react';
import type {
  CampaignAudience,
  Contact,
  TemplateVariableMapping,
  WhatsAppTemplate,
} from '@/types';
import { resolveCandidates, resolveRecipientIds } from '../utils/eligible-recipients';

export const WIZARD_STEPS = [
  'Información',
  'Plantilla',
  'Audiencia',
  'Variables',
  'Programación',
  'Confirmación',
] as const;

export type ScheduleMode = 'draft' | 'scheduled';

export interface WizardState {
  name: string;
  templateId: string | null;
  audience: CampaignAudience;
  manualSelection: string[];
  variableMappings: Record<string, TemplateVariableMapping>;
  scheduleMode: ScheduleMode;
  scheduledAt: string;
}

const INITIAL: WizardState = {
  name: '',
  templateId: null,
  audience: { type: 'all' },
  manualSelection: [],
  variableMappings: {},
  scheduleMode: 'draft',
  scheduledAt: '',
};

/**
 * Estado local del asistente de creación. No toca el workspace hasta confirmar:
 * el paso 6 arma el payload de CREATE_CAMPAIGN con el snapshot de destinatarios.
 */
export function useCampaignWizard(contacts: Contact[], templates: WhatsAppTemplate[]) {
  const [step, setStep] = useState(0);
  const [wizard, setWizard] = useState<WizardState>(INITIAL);

  const patch = (next: Partial<WizardState>) => setWizard((prev) => ({ ...prev, ...next }));

  const template = wizard.templateId
    ? (templates.find((t) => t.id === wizard.templateId) ?? null)
    : null;

  // Candidatos de la audiencia elegida (incluidos + excluidos con motivo).
  const candidates = useMemo(
    () => resolveCandidates(contacts, wizard.audience),
    [contacts, wizard.audience],
  );

  // Snapshot que se guardaría al confirmar, con las reglas de elegibilidad.
  const recipientIds = useMemo(
    () => resolveRecipientIds(contacts, wizard.audience, wizard.manualSelection),
    [contacts, wizard.audience, wizard.manualSelection],
  );

  /** Elige al primer destinatario como contacto de ejemplo para las vistas previas. */
  const sampleContact = contacts.find((c) => c.id === recipientIds[0]) ?? null;

  /** Reglas de avance por paso. El botón "Siguiente" se apoya en esto. */
  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return wizard.name.trim().length > 0;
      case 1:
        return template !== null;
      case 2:
        return recipientIds.length > 0;
      case 3:
        // Toda variable de la plantilla debe tener mapping; los fijos, valor no vacío.
        return (template?.variables ?? []).every((variable) => {
          const mapping = wizard.variableMappings[variable.key];
          if (!mapping) return false;
          return mapping.source === 'contact_name' || mapping.value.trim().length > 0;
        });
      case 4:
        return wizard.scheduleMode === 'draft' || wizard.scheduledAt.trim().length > 0;
      default:
        return true;
    }
  }, [step, wizard, template, recipientIds]);

  return {
    step,
    setStep,
    wizard,
    patch,
    template,
    candidates,
    recipientIds,
    sampleContact,
    canProceed,
    isLast: step === WIZARD_STEPS.length - 1,
  };
}
