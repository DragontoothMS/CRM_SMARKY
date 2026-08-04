/**
 * Marcadores numéricos únicos del body ({{1}}, {{2}}, …), ordenados
 * numéricamente. `{{1}}` repetido no se duplica. Puro, sin estado.
 */
export function parseVariableMarkers(body: string): string[] {
  const found = new Set<number>();
  const re = /\{\{(\d+)\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    found.add(Number(match[1]));
  }
  return [...found].sort((a, b) => a - b).map((n) => `{{${n}}}`);
}
