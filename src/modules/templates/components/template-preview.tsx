import type { TemplateVariable, WhatsAppTemplate } from '@/types';

/**
 * Sustituye los marcadores por el `example` de cada variable. Si falta el
 * ejemplo, deja el marcador visible (señala qué queda por completar). Pura y
 * compartida por el detalle y el preview en vivo del formulario.
 */
export function substituteVariables(body: string, variables: TemplateVariable[]): string {
  return variables.reduce((acc, variable) => {
    if (variable.example.trim() === '') return acc;
    return acc.split(variable.key).join(variable.example);
  }, body);
}

export function renderTemplatePreview(template: WhatsAppTemplate): string {
  return substituteVariables(template.body, template.variables);
}

/** Vista previa de solo lectura, estilo burbuja de WhatsApp neutra. */
export function TemplatePreview({ template }: { template: WhatsAppTemplate }) {
  return (
    <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm break-words whitespace-pre-wrap text-foreground">
      {renderTemplatePreview(template)}
    </p>
  );
}
