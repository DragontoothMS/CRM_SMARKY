'use client';

import { FileBadge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * Plantillas demo. Insertan texto plano en el composer: todavía no hay variables
 * ni plantillas aprobadas reales (eso vive en el módulo Plantillas).
 */
const DEMO_TEMPLATES = [
  {
    id: 'tpl_seguimiento',
    name: 'Seguimiento',
    body: 'Hola, ¿pudiste ver la información que te enviamos? Quedo atento a tus comentarios.',
  },
  {
    id: 'tpl_reapertura',
    name: 'Reapertura',
    body: 'Hola, te escribimos de Smarky para retomar tu consulta. ¿Seguís interesado?',
  },
  {
    id: 'tpl_bienvenida',
    name: 'Bienvenida',
    body: 'Gracias por escribirnos a Smarky. Un asesor te responde en breve dentro del horario de atención.',
  },
];

export function TemplatePicker({
  onSelect,
  disabled,
}: {
  onSelect: (body: string) => void;
  disabled?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon" className="size-10 shrink-0" disabled={disabled}>
            <FileBadge className="size-[18px]" />
            <span className="sr-only">Insertar plantilla</span>
          </Button>
        }
      />
      <PopoverContent align="start" side="top" className="w-72">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Plantillas
        </p>
        <div className="space-y-1">
          {DEMO_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.body)}
              className="w-full rounded-md p-2 text-left transition-colors hover:bg-secondary"
            >
              <span className="block text-sm font-medium text-foreground">{template.name}</span>
              <span className="line-clamp-2 block text-xs text-muted-foreground">
                {template.body}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
