import { Clock3 } from 'lucide-react';

/**
 * Aviso de ventana de 24 h cerrada (solo WhatsApp). Fuera de la ventana, la única
 * acción habilitada es enviar una plantilla.
 */
export function SessionWindowNotice({ hours }: { hours: number | null }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2">
      <Clock3 className="mt-0.5 size-4 shrink-0 text-warning" />
      <p className="text-xs text-foreground">
        <span className="font-medium">Ventana de 24 h cerrada.</span>{' '}
        {hours !== null && `El último mensaje del contacto fue hace ${hours} h. `}
        Para retomar la conversación en WhatsApp tenés que enviar una plantilla aprobada.
      </p>
    </div>
  );
}
