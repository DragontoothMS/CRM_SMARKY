import { cn } from '@/lib/utils';
import type { PipelineStage, StageColor } from '@/types';

/**
 * Color sólido, a diferencia de las etiquetas (pastel con borde): la etapa es
 * posición en el pipeline y hay que distinguirla de un vistazo al escanear.
 */
const STAGE_CLASSES: Record<StageColor, string> = {
  slate: 'bg-slate-500 text-white',
  blue: 'bg-sky-600 text-white',
  amber: 'bg-amber-500 text-white',
  teal: 'bg-teal-600 text-white',
  green: 'bg-green-600 text-white',
  red: 'bg-red-600 text-white',
};

export function StageBadge({ stage, className }: { stage: PipelineStage; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
        STAGE_CLASSES[stage.color],
        className,
      )}
    >
      {stage.name}
    </span>
  );
}
