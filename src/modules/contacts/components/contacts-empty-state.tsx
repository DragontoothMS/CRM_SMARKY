import { SearchX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dos vacíos distintos: no tener contactos no es lo mismo que no encontrarlos,
 * y la salida del segundo es limpiar los filtros.
 */
export function ContactsEmptyState({
  filtered,
  onReset,
}: {
  filtered: boolean;
  onReset: () => void;
}) {
  const Icon = filtered ? SearchX : Users;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        {filtered ? 'Sin resultados' : 'Todavía no hay contactos'}
      </p>
      <p className="max-w-xs text-xs text-muted-foreground">
        {filtered
          ? 'Ningún contacto coincide con la búsqueda o los filtros aplicados.'
          : 'Los contactos aparecen automáticamente cuando alguien escribe por WhatsApp, Instagram o Messenger.'}
      </p>
      {filtered && (
        <Button variant="outline" size="sm" className="mt-1 h-9" onClick={onReset}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
