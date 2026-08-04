'use client';

import Link from 'next/link';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { TemplateDetail } from './template-detail';
import { TemplatesSkeleton } from './templates-skeleton';

/**
 * Resuelve la plantilla por id. Un id inválido muestra "Plantilla no encontrada"
 * con salida a la lista, nunca una redirección silenciosa.
 */
export function TemplateDetailPage({ templateId }: { templateId: string }) {
  const { state } = useWorkspace();
  if (!state) return <TemplatesSkeleton />;

  const template = state.templates[templateId];
  if (!template) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
          <FileX className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Plantilla no encontrada</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          La plantilla que buscás no existe o fue eliminada.
        </p>
        <Button size="sm" className="mt-1 h-9" nativeButton={false} render={<Link href="/plantillas" />}>
          Volver a plantillas
        </Button>
      </div>
    );
  }

  return <TemplateDetail template={template} />;
}
