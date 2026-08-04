import { cn } from '@/lib/utils';
import type { CampaignMetrics } from '@/types';

/**
 * Resumen compacto de resultados. Solo tiene sentido para campañas enviadas;
 * en draft/scheduled/cancelled la actividad es cero y no se muestra.
 */
export function MetricsBar({ metrics, className }: { metrics: CampaignMetrics; className?: string }) {
  const items: Array<[string, number, string]> = [
    ['Enviados', metrics.sent, 'text-foreground'],
    ['Entregados', metrics.delivered, 'text-sky-700'],
    ['Leídos', metrics.read, 'text-green-700'],
    ['Fallidos', metrics.failed, 'text-destructive'],
  ];

  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1', className)}>
      {items.map(([label, value, color]) => (
        <div key={label} className="flex items-baseline gap-1">
          <span className={cn('text-sm font-semibold tabular-nums', color)}>{value}</span>
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
