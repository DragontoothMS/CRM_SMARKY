'use client';

import { useMemo } from 'react';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import type { Channel, PipelineStage, Tag } from '@/types';
import { buildPipelineCards, type PipelineCard } from '../utils/pipeline-cards';

export type AiFilter = 'all' | 'on' | 'off';

export interface PipelineFilters {
  search: string;
  channel: Channel | 'all';
  tagId: string | null;
  ai: AiFilter;
}

export const EMPTY_FILTERS: PipelineFilters = {
  search: '',
  channel: 'all',
  tagId: null,
  ai: 'all',
};

export function countActiveFilters(filters: PipelineFilters): number {
  return (
    Number(filters.channel !== 'all') + Number(filters.tagId !== null) + Number(filters.ai !== 'all')
  );
}

export interface PipelineColumnData {
  stage: PipelineStage;
  cards: PipelineCard[];
}

export interface PipelineView {
  columns: PipelineColumnData[];
  /** Total tras filtrar: distingue "columna vacía" de "sin resultados". */
  totalVisible: number;
  totalCards: number;
  tags: Tag[];
  tagsById: Record<string, Tag>;
  stages: PipelineStage[];
  seededAt: string;
}

/**
 * Deriva el tablero del estado compartido. Sin seed propio: mover una tarjeta
 * despacha SET_STAGE al workspace y el cambio se ve también en Inbox y Contactos.
 */
export function usePipelineView(filters: PipelineFilters): PipelineView | null {
  const { state } = useWorkspace();

  return useMemo(() => {
    if (!state) return null;

    const stages = Object.values(state.stages).sort((a, b) => a.order - b.order);
    const allCards = buildPipelineCards(
      Object.values(state.contacts),
      Object.values(state.conversations),
      state.messagesByConversation,
      state.seededAt,
    );

    const search = filters.search.trim().toLowerCase();
    const visible = allCards.filter((card) => {
      if (filters.channel !== 'all' && card.channel !== filters.channel) return false;
      if (filters.tagId && !card.contact.tagIds.includes(filters.tagId)) return false;
      if (filters.ai !== 'all' && card.aiEnabled !== (filters.ai === 'on')) return false;
      if (!search) return true;
      return (
        card.contact.name.toLowerCase().includes(search) ||
        card.preview.toLowerCase().includes(search)
      );
    });

    return {
      columns: stages.map((stage) => ({
        stage,
        cards: visible
          .filter((card) => card.stageId === stage.id)
          // Lo más inactivo primero: es lo que necesita atención.
          .sort((a, b) => b.hoursInactive - a.hoursInactive),
      })),
      totalVisible: visible.length,
      totalCards: allCards.length,
      tags: Object.values(state.tags),
      tagsById: state.tags,
      stages,
      seededAt: state.seededAt,
    };
  }, [state, filters]);
}
