import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Sección del panel derecho: encabezado con icono + contenido, separadas por
 * borde. Deliberadamente sin tarjeta, para no anidar tarjetas dentro de tarjetas.
 */
export function PanelSection({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
