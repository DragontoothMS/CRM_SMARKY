'use client';

import { useMemo } from 'react';
import type { Channel } from '@/types';
import { resolveListAiState, type ContactSummary } from '../utils/contact-summary';

export type AiFilter = 'all' | 'on' | 'off';

export interface ContactFilters {
  search: string;
  channel: Channel | 'all';
  stageId: string | null;
  tagId: string | null;
  ai: AiFilter;
}

export const EMPTY_FILTERS: ContactFilters = {
  search: '',
  channel: 'all',
  stageId: null,
  tagId: null,
  ai: 'all',
};

export function countActiveFilters(filters: ContactFilters): number {
  return (
    Number(filters.channel !== 'all') +
    Number(filters.stageId !== null) +
    Number(filters.tagId !== null) +
    Number(filters.ai !== 'all')
  );
}

/** Los cinco criterios se combinan con AND. Derivado, nunca estado duplicado. */
export function useVisibleContacts(
  summaries: ContactSummary[],
  filters: ContactFilters,
): ContactSummary[] {
  return useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return summaries
      .filter((summary) => {
        const { contact } = summary;

        if (filters.channel !== 'all') {
          const hasChannel =
            summary.primaryChannel === filters.channel ||
            summary.conversations.some((c) => c.conversation.channel === filters.channel) ||
            contact.channelIdentities.some((i) => i.channel === filters.channel);
          if (!hasChannel) return false;
        }

        if (filters.stageId && contact.stageId !== filters.stageId) return false;
        if (filters.tagId && !contact.tagIds.includes(filters.tagId)) return false;

        if (filters.ai !== 'all') {
          // Con varias conversaciones alcanza con que alguna cumpla.
          const wanted = filters.ai === 'on';
          if (!summary.conversations.some((c) => c.aiEnabled === wanted)) return false;
        }

        if (!search) return true;
        return (
          contact.name.toLowerCase().includes(search) ||
          (contact.phone?.toLowerCase().includes(search) ?? false) ||
          (contact.username?.toLowerCase().includes(search) ?? false) ||
          summary.identity.toLowerCase().includes(search) ||
          // El teléfono se busca también sin separadores: "5493512491491".
          summary.identity.replace(/[\s+()-]/g, '').includes(search.replace(/[\s+()-]/g, ''))
        );
      })
      .sort((a, b) => {
        // Más recientes primero; los que nunca conversaron, al final.
        if (!a.lastInteractionAt) return 1;
        if (!b.lastInteractionAt) return -1;
        return b.lastInteractionAt.localeCompare(a.lastInteractionAt);
      });
  }, [summaries, filters]);
}

export { resolveListAiState };
