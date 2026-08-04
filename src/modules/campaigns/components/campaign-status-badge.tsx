import { AlertTriangle, Ban, CheckCheck, Clock, PencilLine, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CampaignStatus } from '@/types';

/**
 * Cada estado se distingue por tres señales no cromáticas además del matiz:
 * un ícono propio, y una variante de forma — "pendiente" (outline: fondo
 * lavado + borde visible) vs "terminal" (relleno tonal suave + borde
 * transparente). El borde está siempre presente (transparente en terminales)
 * para que la altura de la píldora sea idéntica en ambas variantes.
 */
const STATUS_META: Record<CampaignStatus, { label: string; icon: LucideIcon; className: string }> = {
  draft: {
    label: 'Borrador',
    icon: PencilLine,
    className: 'border-slate-300 bg-slate-50 text-slate-700', // outline
  },
  scheduled: {
    label: 'Programada',
    icon: Clock,
    className: 'border-sky-300 bg-sky-50 text-sky-800', // outline
  },
  completed: {
    label: 'Enviada',
    icon: CheckCheck,
    className: 'border-transparent bg-green-100 text-green-800', // relleno
  },
  failed: {
    label: 'Fallida',
    icon: AlertTriangle,
    className: 'border-transparent bg-red-100 text-red-800', // relleno
  },
  cancelled: {
    label: 'Cancelada',
    icon: Ban,
    className: 'border-transparent bg-amber-100 text-amber-800', // relleno
  },
};

export function CampaignStatusBadge({
  status,
  className,
}: {
  status: CampaignStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        meta.className,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {meta.label}
    </span>
  );
}

export { STATUS_META };
