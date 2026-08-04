'use client';

import { useMemo } from 'react';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { canScheduleOrSend } from '@/modules/templates/utils/template-status';
import type {
  Campaign,
  CampaignStatus,
  Contact,
  PipelineStage,
  Tag,
  WhatsAppTemplate,
} from '@/types';

export type StatusFilter = CampaignStatus | 'all';

export interface CampaignsView {
  campaigns: Campaign[];
  templatesById: Record<string, WhatsAppTemplate>;
  contactsById: Record<string, Contact>;
  /**
   * Plantillas enviables (canScheduleOrSend): activas, aprobadas y sincronizadas.
   * Conserva el nombre `approvedTemplates` para no ampliar el cambio; el módulo
   * Plantillas es dueño de la compuerta. Una campaña no puede programarse/enviarse
   * con una plantilla que no esté en este conjunto.
   */
  approvedTemplates: WhatsAppTemplate[];
  contacts: Contact[];
  tags: Tag[];
  stages: PipelineStage[];
  total: number;
  seededAt: string;
}

/** Deriva la vista de Campañas del estado compartido. */
export function useCampaignsView(): CampaignsView | null {
  const { state } = useWorkspace();

  return useMemo(() => {
    if (!state) return null;

    const campaigns = Object.values(state.campaigns).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );

    return {
      campaigns,
      templatesById: state.templates,
      contactsById: state.contacts,
      approvedTemplates: Object.values(state.templates).filter(canScheduleOrSend),
      contacts: Object.values(state.contacts),
      tags: Object.values(state.tags),
      stages: Object.values(state.stages).sort((a, b) => a.order - b.order),
      total: campaigns.length,
      seededAt: state.seededAt,
    };
  }, [state]);
}
