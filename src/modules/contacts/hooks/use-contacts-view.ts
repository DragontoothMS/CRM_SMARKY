'use client';

import { useMemo } from 'react';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import type { InternalNote, PipelineStage, Tag } from '@/types';
import { buildContactSummary, type ContactSummary } from '../utils/contact-summary';

export interface ContactsView {
  summaries: ContactSummary[];
  tags: Tag[];
  stages: PipelineStage[];
  tagsById: Record<string, Tag>;
  stagesById: Record<string, PipelineStage>;
  notesByConversation: Record<string, InternalNote[]>;
  seededAt: string;
}

/**
 * Deriva la vista de Contactos del estado compartido. No genera seed: los datos
 * son los mismos que ve el Inbox, así que un cambio de etapa o de etiquetas se
 * refleja al instante en ambos.
 *
 * Devuelve null mientras el workspace se inicializa; la página muestra su
 * propio skeleton mientras tanto.
 */
export function useContactsView(): ContactsView | null {
  const { state } = useWorkspace();

  return useMemo(() => {
    if (!state) return null;

    const conversations = Object.values(state.conversations);
    const stages = Object.values(state.stages).sort((a, b) => a.order - b.order);

    return {
      summaries: Object.values(state.contacts).map((contact) =>
        buildContactSummary(contact, conversations),
      ),
      tags: Object.values(state.tags),
      stages,
      tagsById: state.tags,
      stagesById: state.stages,
      notesByConversation: state.notesByConversation,
      seededAt: state.seededAt,
    };
  }, [state]);
}
