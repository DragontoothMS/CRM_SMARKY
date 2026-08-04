'use client';

import Link from 'next/link';
import { FileX, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { isEditableState } from '../utils/template-domain';
import { TemplateForm } from './template-form';
import { TemplatesSkeleton } from './templates-skeleton';

/**
 * Página de edición. Solo edita draft o rejected; para cualquier otro estado
 * muestra un aviso claro con salida al detalle, nunca una redirección silenciosa.
 */
export function TemplateEditPage({ templateId }: { templateId: string }) {
  const { state } = useWorkspace();
  if (!state) return <TemplatesSkeleton />;

  const template = state.templates[templateId];

  if (!template) {
    return (
      <Notice
        icon={FileX}
        title="Plantilla no encontrada"
        hint="La plantilla que buscás no existe o fue eliminada."
        href="/plantillas"
        cta="Volver a plantillas"
      />
    );
  }

  if (!isEditableState(template)) {
    return (
      <Notice
        icon={Lock}
        title="Esta plantilla no puede editarse"
        hint="Solo los borradores y las plantillas rechazadas se pueden editar. Duplicala si querés partir de su contenido."
        href={`/plantillas/${templateId}`}
        cta="Volver al detalle"
      />
    );
  }

  return <TemplateForm mode="edit" template={template} />;
}

function Notice({
  icon: Icon,
  title,
  hint,
  href,
  cta,
}: {
  icon: typeof FileX;
  title: string;
  hint: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{hint}</p>
      <Button size="sm" className="mt-1 h-9" nativeButton={false} render={<Link href={href} />}>
        {cta}
      </Button>
    </div>
  );
}
