import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MessageStatus as Status } from '@/types';

/** Estado de entrega. Solo se muestra si el mensaje lo trae. */
export function MessageStatus({ status }: { status: Status }) {
  switch (status) {
    case 'pending':
      return <Clock className="size-3.5 opacity-60" aria-label="Pendiente" />;
    case 'sent':
      return <Check className="size-3.5 opacity-60" aria-label="Enviado" />;
    case 'delivered':
      return <CheckCheck className="size-3.5 opacity-60" aria-label="Entregado" />;
    case 'read':
      return <CheckCheck className={cn('size-3.5 text-sky-500')} aria-label="Leído" />;
    case 'failed':
      /*
       * Chip rojo con el icono en blanco: un icono rojo sobre el fondo teal de
       * la burbuja saliente quedaba con contraste bajo, y un mensaje que no
       * llegó al cliente es justo lo que no puede pasar desapercibido.
       * El chip mide 16px, dentro del alto de la línea de metadata.
       */
      return (
        <span
          className="inline-flex size-4 items-center justify-center rounded-full bg-destructive ring-1 ring-white/70"
          aria-label="Falló"
          title="No se pudo enviar"
          role="img"
        >
          <AlertCircle className="size-3 text-white" strokeWidth={2.5} />
        </span>
      );
    default:
      return null;
  }
}
