'use client';

import { cn } from '@/lib/utils';
import type { PipelineColumnData } from '../hooks/use-visible-cards';

/**
 * En móvil se ve una columna por vez: comprimir seis columnas en 390px las
 * volvería ilegibles. Este selector reemplaza al scroll horizontal.
 */
export function StageSelectorMobile({
  columns,
  selectedStageId,
  onSelect,
}: {
  columns: PipelineColumnData[];
  selectedStageId: string;
  onSelect: (stageId: string) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-surface px-4 py-2">
      {columns.map(({ stage, cards }) => {
        const isActive = stage.id === selectedStageId;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {stage.name}
            <span
              className={cn(
                'rounded-full px-1.5 text-[11px]',
                isActive ? 'bg-white/20' : 'bg-surface',
              )}
            >
              {cards.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
