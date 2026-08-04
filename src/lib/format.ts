const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Etiqueta corta para la lista: "Ahora", "8m", "21h", "3d", "14 mar".
 * `now` se recibe siempre por parámetro (viene de seededAt) para que el render
 * sea determinístico y no dependa de un Date.now() disperso.
 */
export function formatRelativeShort(iso: string, now: string): string {
  const diff = new Date(now).getTime() - new Date(iso).getTime();
  if (diff < MINUTE) return 'Ahora';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d`;
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

/** Hora del mensaje: "11:43". Formato 24 h: el "a. m./p. m." de es-AR no entra en la burbuja. */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Separador de día: "Hoy", "Ayer" o "24 de marzo de 2026". */
export function formatDateSeparator(iso: string, now: string): string {
  const date = new Date(iso);
  const today = new Date(now);
  if (isSameDay(date, today)) return 'Hoy';
  const yesterday = new Date(today.getTime() - DAY);
  if (isSameDay(date, yesterday)) return 'Ayer';
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Fecha larga para el panel del contacto: "24 mar 2026, 11:43". */
export function formatDateTimeLong(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
