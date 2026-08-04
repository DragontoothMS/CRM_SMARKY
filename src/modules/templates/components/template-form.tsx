'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Send, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import type { TemplateCategory, TemplateVariable, WhatsAppTemplate } from '@/types';
import { useTemplatesView } from '../hooks/use-templates-view';
import { isRejected } from '../utils/template-status';
import { CATEGORY_LABEL } from '../utils/template-filters';
import {
  examplesComplete,
  nameLanguageTaken,
  variablesAreCorrelative,
} from '../utils/template-domain';
import { parseVariableMarkers } from '../utils/parse-variables';
import { substituteVariables } from './template-preview';

const CATEGORIES: TemplateCategory[] = ['marketing', 'utility', 'authentication'];
const LANGUAGE_SUGGESTIONS = ['es', 'es_AR', 'es_ES', 'en', 'en_US', 'pt_BR'];

interface FormErrors {
  name?: string;
  language?: string;
  body?: string;
  variables?: string;
}

export function TemplateForm({
  mode,
  template,
}: {
  mode: 'create' | 'edit';
  template?: WhatsAppTemplate;
}) {
  const router = useRouter();
  const { dispatch } = useWorkspace();
  const view = useTemplatesView();

  const [name, setName] = useState(template?.name ?? '');
  const [category, setCategory] = useState<TemplateCategory>(template?.category ?? 'marketing');
  const [language, setLanguage] = useState(template?.language ?? 'es_AR');
  const [body, setBody] = useState(template?.body ?? '');
  const [examples, setExamples] = useState<Record<string, string>>(() =>
    Object.fromEntries((template?.variables ?? []).map((v) => [v.key, v.example])),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  const rejectedCorrection = mode === 'edit' && !!template && isRejected(template);
  const editingId = template?.id;

  // Variables derivadas del body: marcadores únicos ordenados numéricamente. Los
  // ejemplos escritos se conservan (viven en `examples`); los marcadores que
  // desaparecen dejan de renderizarse. Sin efectos → sin set-state-in-effect.
  const markers = useMemo(() => parseVariableMarkers(body), [body]);
  const variables: TemplateVariable[] = useMemo(
    () => markers.map((key) => ({ key, example: examples[key] ?? '' })),
    [markers, examples],
  );
  const preview = substituteVariables(body, variables);
  const templates = view?.templates ?? [];

  // Limpia el error de un campo en cuanto el usuario lo corrige.
  const clearError = (...fields: Array<keyof FormErrors>) =>
    setErrors((prev) => {
      const next = { ...prev };
      for (const f of fields) delete next[f];
      return next;
    });

  function draftErrors(): FormErrors {
    const e: FormErrors = {};
    if (name.trim() === '') e.name = 'El nombre es obligatorio.';
    else if (nameLanguageTaken(templates, name, language, editingId))
      e.name = 'Ya existe una plantilla con ese nombre e idioma.';
    if (language.trim() === '') e.language = 'El idioma es obligatorio.';
    return e;
  }

  function submitErrors(): FormErrors {
    const e = draftErrors();
    if (body.trim() === '') e.body = 'El contenido no puede estar vacío para enviar a revisión.';
    if (!variablesAreCorrelative(variables))
      e.variables = 'Las variables deben ser correlativas desde {{1}}, sin huecos.';
    else if (!examplesComplete(variables))
      e.variables = 'Cada variable necesita un ejemplo para enviar a revisión.';
    return e;
  }

  const hasErrors = (e: FormErrors) => Object.keys(e).length > 0;
  const stamp = () => new Date().toISOString();

  function saveDraft() {
    if (busy) return;
    const e = draftErrors();
    setErrors(e);
    if (hasErrors(e)) return;
    setBusy(true);
    const at = stamp();
    if (mode === 'create') {
      const id = `tpl_${Date.now().toString(36)}`;
      dispatch({
        type: 'CREATE_TEMPLATE',
        payload: { id, name: name.trim(), category, language: language.trim(), body, variables, createdAt: at },
      });
      router.push(`/plantillas/${id}`);
    } else if (editingId) {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { id: editingId, name: name.trim(), category, language: language.trim(), body, variables, updatedAt: at },
      });
      router.push(`/plantillas/${editingId}`);
    }
  }

  function saveAndSubmit() {
    if (busy) return;
    const e = submitErrors();
    setErrors(e);
    // No se crea un borrador accidental si la validación de envío falla antes del dispatch.
    if (hasErrors(e)) return;
    setBusy(true);
    const at = stamp();
    if (mode === 'create') {
      const id = `tpl_${Date.now().toString(36)}`;
      dispatch({
        type: 'CREATE_TEMPLATE',
        payload: { id, name: name.trim(), category, language: language.trim(), body, variables, createdAt: at },
      });
      dispatch({ type: 'SUBMIT_TEMPLATE', templateId: id, submittedAt: at });
      router.push(`/plantillas/${id}`);
    } else if (editingId) {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { id: editingId, name: name.trim(), category, language: language.trim(), body, variables, updatedAt: at },
      });
      dispatch({ type: 'SUBMIT_TEMPLATE', templateId: editingId, submittedAt: at });
      router.push(`/plantillas/${editingId}`);
    }
  }

  const backHref = mode === 'edit' && editingId ? `/plantillas/${editingId}` : '/plantillas';

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="size-9 shrink-0" nativeButton={false} render={<Link href={backHref} />}>
          <ArrowLeft className="size-[18px]" aria-hidden />
          <span className="sr-only">Volver</span>
        </Button>
        <h1 className="text-base font-semibold text-foreground">
          {mode === 'create' ? 'Nueva plantilla' : rejectedCorrection ? 'Corregir plantilla' : 'Editar borrador'}
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rejectedCorrection && (
          <div className="mx-4 mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            Al guardar cambios, esta plantilla volverá a borrador.
          </div>
        )}

        <div className="grid gap-6 p-4 lg:grid-cols-2">
          {/* Formulario */}
          <div className="space-y-4">
            <Field id="tpl-name" label="Nombre" error={errors.name}>
              <Input
                id="tpl-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError('name');
                }}
                placeholder="promo_lanzamiento"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'tpl-name-error' : undefined}
              />
            </Field>

            <div className="space-y-1.5">
              <span id="tpl-category-label" className="text-xs font-medium text-foreground">
                Categoría
              </span>
              <div role="group" aria-labelledby="tpl-category-label" className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                      category === c
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-surface text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {CATEGORY_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            <Field id="tpl-language" label="Idioma" error={errors.language}>
              <Input
                id="tpl-language"
                list="lang-suggestions"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  clearError('language', 'name');
                }}
                placeholder="es_AR"
                aria-invalid={!!errors.language}
                aria-describedby={errors.language ? 'tpl-language-error' : undefined}
              />
              <datalist id="lang-suggestions">
                {LANGUAGE_SUGGESTIONS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </Field>

            <Field id="tpl-body" label="Contenido" error={errors.body} hint="Usá {{1}}, {{2}}… para insertar variables.">
              <Textarea
                id="tpl-body"
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  clearError('body', 'variables');
                }}
                placeholder="Hola {{1}}, tenemos novedades para vos."
                className="min-h-28"
                aria-invalid={!!errors.body}
                aria-describedby={errors.body ? 'tpl-body-error' : undefined}
              />
            </Field>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-foreground">Variables · {variables.length}</span>
              {variables.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Sin variables. Una plantilla sin variables es válida.
                </p>
              ) : (
                <div className="space-y-2">
                  {variables.map((v) => (
                    <div key={v.key} className="flex items-center gap-2">
                      <span aria-hidden className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                        {v.key}
                      </span>
                      <Input
                        aria-label={`Ejemplo para ${v.key}`}
                        value={examples[v.key] ?? ''}
                        onChange={(e) => {
                          setExamples((prev) => ({ ...prev, [v.key]: e.target.value }));
                          clearError('variables');
                        }}
                        placeholder="Ejemplo"
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              )}
              {errors.variables && (
                <p role="alert" className="text-[11px] font-medium text-destructive">
                  {errors.variables}
                </p>
              )}
            </div>
          </div>

          {/* Preview en vivo */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Eye className="size-3.5" aria-hidden />
              Vista previa
            </div>
            <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm break-words whitespace-pre-wrap text-foreground">
              {preview || 'El contenido aparecerá acá.'}
            </p>
          </div>
        </div>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Button variant="outline" size="sm" className="h-9" disabled={busy} onClick={saveDraft}>
          <Save className="size-4" aria-hidden />
          Guardar {mode === 'create' ? 'borrador' : 'cambios'}
        </Button>
        <Button size="sm" className="h-9" disabled={busy} onClick={saveAndSubmit}>
          <Send className="size-4" aria-hidden />
          {rejectedCorrection ? 'Corregir y enviar a revisión' : 'Enviar a revisión'}
        </Button>
      </footer>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
