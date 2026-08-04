import type { Contact, TemplateVariableMapping, WhatsAppTemplate } from '@/types';

/**
 * Resuelve el valor de una variable para un contacto concreto.
 * En este MVP solo hay dos fuentes: un valor fijo o el nombre del contacto.
 */
export function resolveMapping(
  mapping: TemplateVariableMapping | undefined,
  contact: Contact | null,
): string {
  if (!mapping) return '';
  if (mapping.source === 'contact_name') return contact?.name ?? '';
  return mapping.value;
}

/**
 * Sustituye los marcadores del body por sus valores para un contacto de ejemplo.
 * Si falta un mapping, deja el marcador visible: así el wizard muestra qué queda
 * por completar en vez de renderizar un hueco silencioso.
 */
export function renderTemplateBody(
  template: WhatsAppTemplate,
  mappings: Record<string, TemplateVariableMapping>,
  sampleContact: Contact | null,
): string {
  return template.variables.reduce((body, variable) => {
    const mapping = mappings[variable.key];
    if (!mapping) return body;
    return body.split(variable.key).join(resolveMapping(mapping, sampleContact));
  }, template.body);
}
