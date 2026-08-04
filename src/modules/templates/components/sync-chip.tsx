import { RefreshCwOff, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WhatsAppTemplate } from '@/types';
import { getSyncPresentation } from '../utils/template-status';

/**
 * Chip de sincronización, independiente del badge de estado. Se auto-oculta si
 * la plantilla no lo necesita. El texto y el tono vienen de getSyncPresentation
 * (fuente única): "Sincronización pendiente" (espera normal) vs "Sin sincronizar"
 * (divergencia). Así una "En revisión" no parece tener un error.
 */
export function SyncChip({ template, className }: { template: WhatsAppTemplate; className?: string }) {
  const sync = getSyncPresentation(template);
  if (!sync) return null;

  const Icon = sync.tone === 'waiting' ? RotateCw : RefreshCwOff;
  const tone =
    sync.tone === 'waiting'
      ? 'border-sky-300 bg-sky-50 text-sky-800'
      : 'border-amber-300 bg-amber-50 text-amber-800';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
        tone,
        className,
      )}
    >
      <Icon className="size-2.5 shrink-0" aria-hidden />
      {sync.label}
    </span>
  );
}
