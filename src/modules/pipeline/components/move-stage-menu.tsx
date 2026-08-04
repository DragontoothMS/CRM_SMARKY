'use client';

import { ArrowRightLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PipelineStage } from '@/types';

/**
 * Alternativa al arrastre. HTML5 Drag and Drop no emite eventos en pantallas
 * táctiles, así que en tablet y móvil esta es la única forma de mover una
 * tarjeta — y en una pantalla chica es además más cómoda que arrastrar.
 */
export function MoveStageMenu({
  stages,
  currentStageId,
  onMove,
  className,
  label = 'Mover a etapa',
}: {
  stages: PipelineStage[];
  currentStageId: string;
  onMove: (stageId: string) => void;
  className?: string;
  label?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            // El tablero escucha clics para abrir el detalle: este botón no debe propagarlos.
            onClick={(event) => event.stopPropagation()}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
              className,
            )}
          >
            <ArrowRightLeft className="size-3" />
            {label}
          </button>
        }
      />
      <DropdownMenuContent align="start" className="w-48">
        {stages.map((stage) => (
          <DropdownMenuItem
            key={stage.id}
            disabled={stage.id === currentStageId}
            onClick={(event) => {
              event.stopPropagation();
              onMove(stage.id);
            }}
          >
            <span className="flex-1">{stage.name}</span>
            {stage.id === currentStageId && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
