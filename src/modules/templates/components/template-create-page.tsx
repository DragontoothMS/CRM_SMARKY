'use client';

import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { TemplateForm } from './template-form';
import { TemplatesSkeleton } from './templates-skeleton';

/** Página de creación: espera a que el workspace hidrate antes del formulario. */
export function TemplateCreatePage() {
  const { state } = useWorkspace();
  if (!state) return <TemplatesSkeleton />;
  return <TemplateForm mode="create" />;
}
