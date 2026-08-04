'use client';

import { useState } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { useMediaQuery } from '@/modules/inbox/hooks/use-media-query';
import {
  EMPTY_FILTERS,
  usePipelineView,
  type PipelineFilters,
} from '../hooks/use-visible-cards';
import { OpportunityDetail } from './opportunity-detail';
import { PipelineColumn } from './pipeline-column';
import { PipelineHeader } from './pipeline-header';
import { PipelineSkeleton } from './pipeline-skeleton';
import { StageSelectorMobile } from './stage-selector-mobile';

export function PipelineBoard() {
  const { state, dispatch } = useWorkspace();
  const [filters, setFilters] = useState<PipelineFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mobileStageId, setMobileStageId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'board' | 'detail'>('board');

  const isMobile = useMediaQuery('(max-width: 767px)');
  // HTML5 Drag and Drop no emite eventos en pantallas táctiles.
  const isTouch = useMediaQuery('(pointer: coarse)');
  const canDrag = !isMobile && !isTouch;

  const view = usePipelineView(filters);
  if (!view || !state) return <PipelineSkeleton />;

  const selectedCard =
    view.columns.flatMap((column) => column.cards).find((card) => card.id === selectedId) ?? null;

  function handleMove(cardId: string, stageId: string) {
    // Mutación compartida: se refleja en Inbox y Contactos al instante.
    dispatch({ type: 'SET_STAGE', contactId: cardId, stageId });
  }

  function handleSelect(cardId: string) {
    setSelectedId(cardId);
    setMobileView('detail');
  }

  const activeStageId = mobileStageId ?? view.columns[0]?.stage.id ?? '';
  const mobileColumn =
    view.columns.find((column) => column.stage.id === activeStageId) ?? view.columns[0];

  const detail = selectedCard ? (
    <OpportunityDetail
      card={selectedCard}
      tags={selectedCard.contact.tagIds.map((id) => view.tagsById[id]).filter(Boolean)}
      stage={state.stages[selectedCard.stageId]}
      stages={view.stages}
      notes={state.notesByConversation[selectedCard.conversation.id] ?? []}
      onMove={(stageId) => handleMove(selectedCard.id, stageId)}
      onBack={isMobile ? () => setMobileView('board') : undefined}
      onClose={!isMobile ? () => setSelectedId(null) : undefined}
    />
  ) : null;

  // Móvil: una vista por vez.
  if (isMobile && mobileView === 'detail' && detail) {
    return <div className="h-full min-h-0">{detail}</div>;
  }

  const noResults = view.totalVisible === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PipelineHeader
        filters={filters}
        total={view.totalVisible}
        tags={view.tags}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {isMobile && !noResults && (
        <StageSelectorMobile
          columns={view.columns}
          selectedStageId={activeStageId}
          onSelect={setMobileStageId}
        />
      )}

      {noResults ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
            <SearchX className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Sin resultados</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Ninguna oportunidad coincide con la búsqueda o los filtros aplicados.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-1 h-9"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : isMobile ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {mobileColumn && (
            <PipelineColumn
              stage={mobileColumn.stage}
              cards={mobileColumn.cards}
              stages={view.stages}
              tagsById={view.tagsById}
              selectedId={selectedId}
              draggingId={draggingId}
              canDrag={false}
              now={view.seededAt}
              fullWidth
              onSelect={handleSelect}
              onMove={handleMove}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
            />
          )}
        </div>
      ) : (
        // El scroll horizontal vive acá dentro, nunca en la página.
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex h-full min-h-0 gap-3">
            {view.columns.map((column) => (
              <PipelineColumn
                key={column.stage.id}
                stage={column.stage}
                cards={column.cards}
                stages={view.stages}
                tagsById={view.tagsById}
                selectedId={selectedId}
                draggingId={draggingId}
                canDrag={canDrag}
                now={view.seededAt}
                onSelect={handleSelect}
                onMove={handleMove}
                onDragStart={setDraggingId}
                onDragEnd={() => setDraggingId(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drawer: un panel fijo le robaría ancho al tablero, que es lo que no sobra. */}
      {!isMobile && detail && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20"
            onClick={() => setSelectedId(null)}
            aria-label="Cerrar detalle"
          />
          <div className="absolute inset-y-0 right-0 w-[min(380px,92vw)] border-l border-border shadow-lg">
            {detail}
          </div>
        </div>
      )}
    </div>
  );
}
