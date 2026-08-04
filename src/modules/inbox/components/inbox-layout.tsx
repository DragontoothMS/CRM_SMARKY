'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useInbox } from '../hooks/use-inbox';
import { useMediaQuery } from '../hooks/use-media-query';
import { ChatPanel } from './chat/chat-panel';
import { ContactPanel } from './contact-panel/contact-panel';
import { ConversationList } from './conversation-list/conversation-list';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Cuatro zonas a altura completa. Responsive:
 * - xl: lista + chat + panel derecho como columna fija.
 * - lg: lista + chat, panel derecho como overlay.
 * - <lg: una vista por vez (lista o chat).
 */
export function InboxLayout() {
  const { state } = useInbox();
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  /*
   * El panel derecho arranca abierto solo donde es una columna (xl). Debajo es un
   * overlay, y abrirlo por defecto taparía el chat al entrar.
   *
   * `override` es null hasta que el usuario toca el botón: hasta entonces el
   * panel sigue al viewport, y después manda la decisión del usuario. Derivarlo
   * evita espejar isWide en un estado con un efecto.
   */
  const isWide = useMediaQuery('(min-width: 1280px)');
  const [override, setOverride] = useState<boolean | null>(null);
  const detailsOpen = override ?? isWide;

  const showDetails = detailsOpen && Boolean(state.selectedConversationId);

  return (
    <TooltipProvider delay={0}>
    <div className="flex h-full min-h-0">
      {/*
        La lista se estrecha en lg: a 1024px, sidebar (256) + lista (380) + el
        mínimo del chat no entran, y el chat desbordaba en horizontal.
      */}
      <div
        className={cn(
          'w-full min-w-0 shrink-0 border-r border-border lg:block lg:w-[340px] xl:w-[380px]',
          mobileView === 'chat' && 'hidden lg:block',
        )}
      >
        <ConversationList onSelect={() => setMobileView('chat')} />
      </div>

      <div
        className={cn('min-w-0 flex-1 xl:min-w-[480px]', mobileView === 'list' && 'hidden lg:block')}
      >
        <ChatPanel
          detailsOpen={showDetails}
          onToggleDetails={() => setOverride(!detailsOpen)}
          onBack={() => setMobileView('list')}
        />
      </div>

      {showDetails &&
        (isWide ? (
          <div className="w-[340px] shrink-0 border-l border-border">
            <ContactPanel onClose={() => setOverride(false)} />
          </div>
        ) : (
          <div className="fixed inset-0 z-40">
            <button
              type="button"
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setOverride(false)}
              aria-label="Cerrar detalles"
            />
            <div className="absolute inset-y-0 right-0 w-[min(340px,90vw)] border-l border-border shadow-lg">
              <ContactPanel onClose={() => setOverride(false)} />
            </div>
          </div>
        ))}
    </div>
    </TooltipProvider>
  );
}
