'use client';

import { useMemo } from 'react';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import type { WhatsAppTemplate } from '@/types';

export interface TemplatesView {
  /** Todas las plantillas, ordenadas por actualización desc (incluye papelera). */
  templates: WhatsAppTemplate[];
  /** Plantillas no eliminadas (para el contador del encabezado). */
  activeCount: number;
  /** Plantillas en papelera (deleted local). */
  trashCount: number;
  seededAt: string;
}

/** Deriva la vista de Plantillas del estado compartido. */
export function useTemplatesView(): TemplatesView | null {
  const { state } = useWorkspace();

  return useMemo(() => {
    if (!state) return null;
    const templates = Object.values(state.templates).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
    return {
      templates,
      activeCount: templates.filter((t) => t.localStatus !== 'deleted').length,
      trashCount: templates.filter((t) => t.localStatus === 'deleted').length,
      seededAt: state.seededAt,
    };
  }, [state]);
}
