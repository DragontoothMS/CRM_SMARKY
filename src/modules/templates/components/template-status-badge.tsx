import {
  Archive,
  Ban,
  CheckCheck,
  CircleSlash,
  Clock,
  EyeOff,
  Gavel,
  HelpCircle,
  PencilLine,
  ShieldOff,
  Trash2,
  TriangleAlert,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WhatsAppTemplate } from '@/types';
import { presentedStatus, type PresentedStatus } from '../utils/template-status';

/**
 * Un badge por estado presentado. Cada estado se distingue por ícono + texto,
 * no solo por color (accesible para daltonismo). `outline` marca estados "en
 * curso" (borrador/en revisión); el resto usa relleno tonal suave. El borde
 * está siempre presente (transparente en relleno) para altura idéntica.
 */
const META: Record<PresentedStatus, { label: string; icon: LucideIcon; className: string; outline?: boolean }> = {
  draft: { label: 'Borrador', icon: PencilLine, className: 'border-slate-300 bg-slate-50 text-slate-700', outline: true },
  pending: { label: 'En revisión', icon: Clock, className: 'border-sky-300 bg-sky-50 text-sky-800', outline: true },
  approved: { label: 'Aprobada', icon: CheckCheck, className: 'border-transparent bg-green-100 text-green-800' },
  rejected: { label: 'Rechazada', icon: XCircle, className: 'border-transparent bg-red-100 text-red-800' },
  paused: { label: 'Pausada', icon: Ban, className: 'border-transparent bg-amber-100 text-amber-800' },
  local_disabled: { label: 'Deshabilitada', icon: EyeOff, className: 'border-transparent bg-slate-200 text-slate-700' },
  remote_disabled: { label: 'Deshabilitada por Meta', icon: ShieldOff, className: 'border-transparent bg-zinc-200 text-zinc-700' },
  in_appeal: { label: 'En apelación', icon: Gavel, className: 'border-transparent bg-violet-100 text-violet-800' },
  pending_deletion: { label: 'Baja pendiente', icon: Trash2, className: 'border-transparent bg-orange-100 text-orange-800' },
  archived: { label: 'Archivada', icon: Archive, className: 'border-transparent bg-stone-200 text-stone-700' },
  limit_exceeded: { label: 'Límite excedido', icon: TriangleAlert, className: 'border-transparent bg-amber-100 text-amber-900' },
  remote_deleted: { label: 'Eliminada en Meta', icon: CircleSlash, className: 'border-transparent bg-red-100 text-red-900' },
  unknown: { label: 'Estado desconocido', icon: HelpCircle, className: 'border-transparent bg-zinc-200 text-zinc-700' },
  deleted: { label: 'Eliminada', icon: Trash2, className: 'border-transparent bg-slate-200 text-slate-600' },
};

export function TemplateStatusBadge({
  template,
  className,
}: {
  template: WhatsAppTemplate;
  className?: string;
}) {
  const meta = META[presentedStatus(template)];
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
