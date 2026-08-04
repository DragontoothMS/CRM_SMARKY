'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * matchMedia es una fuente externa, así que se suscribe con useSyncExternalStore
 * en vez de espejar el valor en un useState dentro de un efecto.
 *
 * El snapshot del servidor es `false`. No genera mismatch: el inbox se monta
 * recién después de que el seed corre en cliente.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
