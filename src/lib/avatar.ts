/** Paleta de avatares. Evita el verde de WhatsApp para no competir con el distintivo de canal. */
const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-sky-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-cyan-700',
  'bg-fuchsia-700',
] as const;

/** Iniciales: "Bautista Liendo" → "BL", "@tebutz" → "TE". */
export function getInitials(name: string): string {
  const clean = name.replace(/^@/, '').trim();
  if (!clean) return '?';
  const words = clean.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Color estable para un contacto: mismo nombre → mismo color, sin estado. */
export function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
