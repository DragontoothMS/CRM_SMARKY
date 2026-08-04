'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Eye,
  EyeOff,
  PencilLine,
  RotateCcw,
  Send,
  Trash2,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import type { WhatsAppTemplate } from '@/types';
import { meetsSubmitRequirements, nameLanguageTaken } from '../utils/template-domain';
import { availableTemplateActions } from '../utils/template-actions';

/**
 * Acciones del detalle, derivadas de availableTemplateActions (fuente única).
 * Solo acciones locales; el reducer sigue siendo la última barrera. Duplicar
 * navega a la edición de la copia; eliminar/restaurar piden confirmación y la
 * restauración verifica colisión name+language antes de despachar.
 */
export function TemplateActionsBar({ template }: { template: WhatsAppTemplate }) {
  const router = useRouter();
  const { state, dispatch } = useWorkspace();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [restoreConflict, setRestoreConflict] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  if (!state) return null;
  const actions = availableTemplateActions(template);
  const at = () => new Date().toISOString();
  const editHref = `/plantillas/${template.id}/editar`;

  function handleSubmit() {
    const collides = nameLanguageTaken(
      Object.values(state!.templates),
      template.name,
      template.language,
      template.id,
    );
    if (!meetsSubmitRequirements(template) || collides) {
      setSubmitError(true);
      return;
    }
    dispatch({ type: 'SUBMIT_TEMPLATE', templateId: template.id, submittedAt: at() });
  }

  function handleDuplicate() {
    const newId = `tpl_${Date.now().toString(36)}`;
    dispatch({ type: 'DUPLICATE_TEMPLATE', templateId: template.id, newId, createdAt: at() });
    router.push(`/plantillas/${newId}/editar`);
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TEMPLATE', templateId: template.id, updatedAt: at() });
    router.push('/plantillas');
  }

  function askRestore() {
    if (nameLanguageTaken(Object.values(state!.templates), template.name, template.language, template.id)) {
      setRestoreConflict(true);
      return;
    }
    setConfirmRestore(true);
  }

  function handleRestore() {
    dispatch({ type: 'RESTORE_TEMPLATE', templateId: template.id, updatedAt: at() });
    setConfirmRestore(false);
  }

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {actions.includes('edit') && (
          <Button variant="outline" size="sm" className="h-8" nativeButton={false} render={<Link href={editHref} />}>
            <PencilLine className="size-3.5" />
            Editar
          </Button>
        )}
        {actions.includes('correct') && (
          <Button variant="outline" size="sm" className="h-8" nativeButton={false} render={<Link href={editHref} />}>
            <Wrench className="size-3.5" />
            Corregir
          </Button>
        )}
        {actions.includes('submit') && (
          <Button size="sm" className="h-8" onClick={handleSubmit}>
            <Send className="size-3.5" />
            Enviar a revisión
          </Button>
        )}
        {actions.includes('duplicate') && (
          <Button variant="outline" size="sm" className="h-8" onClick={handleDuplicate}>
            <Copy className="size-3.5" />
            Duplicar
          </Button>
        )}
        {actions.includes('disable') && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => dispatch({ type: 'DISABLE_TEMPLATE', templateId: template.id, updatedAt: at() })}
          >
            <EyeOff className="size-3.5" />
            Deshabilitar
          </Button>
        )}
        {actions.includes('enable') && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => dispatch({ type: 'ENABLE_TEMPLATE', templateId: template.id, updatedAt: at() })}
          >
            <Eye className="size-3.5" />
            Habilitar
          </Button>
        )}
        {actions.includes('delete') &&
          (confirmDelete ? (
            <span className="flex items-center gap-1.5">
              <Button variant="destructive" size="sm" className="h-8" onClick={handleDelete}>
                Eliminar
              </Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </span>
          ) : (
            <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-3.5" />
              Eliminar
            </Button>
          ))}
        {actions.includes('restore') &&
          (confirmRestore ? (
            <span className="flex items-center gap-1.5">
              <Button size="sm" className="h-8" onClick={handleRestore}>
                Restaurar
              </Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setConfirmRestore(false)}>
                No
              </Button>
            </span>
          ) : (
            <Button variant="outline" size="sm" className="h-8" onClick={askRestore}>
              <RotateCcw className="size-3.5" />
              Restaurar
            </Button>
          ))}
      </div>

      {actions.includes('delete') && confirmDelete && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Esta plantilla se moverá a la papelera. No se eliminará de Meta.
        </p>
      )}
      {submitError && (
        <p className="mt-2 text-[11px] font-medium text-destructive">
          Faltan datos para enviar a revisión. Editá la plantilla para completar el contenido, las
          variables y sus ejemplos.
        </p>
      )}
      {restoreConflict && (
        <p className="mt-2 text-[11px] font-medium text-destructive">
          No se puede restaurar porque ya existe una plantilla con el mismo nombre e idioma.
        </p>
      )}
    </div>
  );
}
