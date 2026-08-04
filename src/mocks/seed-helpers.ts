/**
 * Helpers de tiempo relativo para el seed.
 *
 * Todos los timestamps demo se construyen contra el `now` que recibe
 * createSeedData(). Con fechas fijas, la conversación "fuera de la ventana de
 * 24 h" se volvería cada vez más vieja y "Ahora" pasaría a decir "3d" en pocos
 * días: la demo envejecería. Así, siempre se ve igual de fresca.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function minutesAgo(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * MINUTE).toISOString();
}

export function hoursAgo(now: Date, hours: number): string {
  return new Date(now.getTime() - hours * HOUR).toISOString();
}

export function daysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * DAY).toISOString();
}
