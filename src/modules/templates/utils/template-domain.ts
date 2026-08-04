import type { TemplateCategory, TemplateVariable, WhatsAppTemplate } from '@/types';

/**
 * Reglas de dominio puras de Plantillas: validación, unicidad y generación
 * determinista del nombre de copia. Sin React, sin estado, sin Date.now().
 * El reducer las consume para mantener sus casos legibles y testeables.
 */

const CATEGORIES: readonly TemplateCategory[] = ['marketing', 'utility', 'authentication'];

export function isValidCategory(value: string): value is TemplateCategory {
  return (CATEGORIES as readonly string[]).includes(value);
}

/**
 * Unicidad name+language de Meta, evaluada solo entre plantillas NO eliminadas.
 * `exceptId` excluye la propia plantilla (útil al editar/enviar).
 */
export function nameLanguageTaken(
  templates: WhatsAppTemplate[],
  name: string,
  language: string,
  exceptId?: string,
): boolean {
  const target = name.trim().toLowerCase();
  return templates.some(
    (t) =>
      t.localStatus !== 'deleted' &&
      t.id !== exceptId &&
      t.language === language &&
      t.name.trim().toLowerCase() === target,
  );
}

/** Numeración correlativa desde {{1}} sin huecos. Sin variables → válido. */
export function variablesAreCorrelative(variables: TemplateVariable[]): boolean {
  return variables.every((v, i) => v.key === `{{${i + 1}}}`);
}

/** Cada variable con ejemplo no vacío. Sin variables → válido. */
export function examplesComplete(variables: TemplateVariable[]): boolean {
  return variables.every((v) => v.example.trim() !== '');
}

/**
 * Variables correlativas desde {{1}} sin huecos, cada una con ejemplo no vacío.
 * Una plantilla sin variables es válida. No exige que el body las contenga: ese
 * acoplamiento pertenece al parseo de la UI (Fase 3).
 */
export function variablesValid(variables: TemplateVariable[]): boolean {
  return variablesAreCorrelative(variables) && examplesComplete(variables);
}

/**
 * ¿La plantilla cumple todo lo necesario para enviarse a revisión?
 * (name, language, category, body y variables). La unicidad name+language se
 * evalúa aparte en el reducer porque necesita el conjunto completo.
 */
export function meetsSubmitRequirements(t: WhatsAppTemplate): boolean {
  return (
    t.name.trim() !== '' &&
    t.language.trim() !== '' &&
    isValidCategory(t.category) &&
    t.body.trim() !== '' &&
    variablesValid(t.variables)
  );
}

/** Editable / enviable: solo borrador o rechazada. */
export function isEditableState(t: WhatsAppTemplate): boolean {
  return t.localStatus === 'draft' || (t.localStatus === 'active' && t.remoteStatus === 'rejected');
}

/**
 * Nombre local libre para una copia. Quita un sufijo _copy/_copy_N previo para
 * no apilarlos, y devuelve el primero disponible entre plantillas no eliminadas
 * del mismo idioma: base_copy, base_copy_2, base_copy_3, …
 */
export function generateCopyName(
  templates: WhatsAppTemplate[],
  sourceName: string,
  language: string,
): string {
  const base = sourceName.replace(/_copy(_\d+)?$/, '');
  const taken = (name: string) =>
    templates.some(
      (t) => t.localStatus !== 'deleted' && t.language === language && t.name === name,
    );

  let candidate = `${base}_copy`;
  let n = 2;
  while (taken(candidate)) {
    candidate = `${base}_copy_${n}`;
    n += 1;
  }
  return candidate;
}
