'use client';

import { createContext, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { inboxUiReducer, loadPersistedState } from './inbox-reducer';
import type { InboxAction, InboxState } from './inbox-types';

export interface InboxContextValue {
  state: InboxState;
  dispatch: React.Dispatch<InboxAction>;
  sendMedia: (file: File, caption?: string) => Promise<void>;
}

export const InboxContext = createContext<InboxContextValue | null>(null);

/**
 * Fachada sobre el estado compartido.
 *
 * Los datos viven en WorkspaceProvider —compartidos con Contactos y Pipeline— y
 * la parte visual (conversación abierta, filtros) se queda acá. Los componentes
 * siguen viendo un único `state` y un único `dispatch`, con la misma firma que
 * antes del estado compartido: ninguno tuvo que cambiar.
 */
export function InboxProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { state: workspace, dispatch: workspaceDispatch, sendMessage, sendMedia, setActiveConversationId } = useWorkspace();
  const [ui, uiDispatch] = useReducer(inboxUiReducer, null, () => loadPersistedState());
  // `?c=<conversationId>` permite entrar desde Contactos o Pipeline.
  const conversationParam = useSearchParams().get('c');

  /**
   * Reparte cada acción según a quién pertenece. El switch es exhaustivo: si se
   * agrega una acción y no se enruta, TypeScript rompe el build en `never`.
   */
  const inboxDispatch = useCallback<React.Dispatch<InboxAction>>(
    (action) => {
      switch (action.type) {
        case 'SELECT_CONVERSATION': {
          uiDispatch({ type: 'SELECT', conversationId: action.conversationId });
          setActiveConversationId(action.conversationId);
          if (action.conversationId) {
            workspaceDispatch({
              type: 'MARK_CONVERSATION_READ',
              conversationId: action.conversationId,
            });
          }
          return;
        }
        case 'SEND_MESSAGE': {
          sendMessage(action.conversationId, action.text);
          return;
        }
        case 'SEND_MEDIA': {
          sendMedia(action.conversationId, action.file, action.caption);
          return;
        }
        case 'SET_CHANNEL_FILTER':
        case 'SET_TAG_FILTER':
        case 'SET_STAGE_FILTER':
        case 'SET_SEARCH':
          uiDispatch(action);
          return;
        case 'HYDRATE':
        case 'TOGGLE_AI':
        case 'ADD_TAG':
        case 'REMOVE_TAG':
        case 'SET_STAGE':
        case 'ADD_NOTE':
          workspaceDispatch(action);
          return;
        default: {
          const exhaustive: never = action;
          return exhaustive;
        }
      }
    },
    [workspaceDispatch, sendMessage, sendMedia, setActiveConversationId],
  );

  /*
   * Se despacha una vez que el workspace hidrató y solo cuando cambia el
   * parámetro, no en cada render. Si el id no existe, la selección cae en la
   * primera conversación: un enlace roto no rompe la página.
   */
  const isReady = workspace !== null;
  useEffect(() => {
    if (!isReady || !conversationParam) return;
    inboxDispatch({ type: 'SELECT_CONVERSATION', conversationId: conversationParam });
  }, [isReady, conversationParam, inboxDispatch]);

  const value = useMemo<InboxContextValue | null>(() => {
    if (!workspace) return null;

    /*
     * Sin selección válida se abre la primera conversación, como antes. Se
     * deriva en vez de despacharse en un efecto, así no hay un render
     * intermedio con el chat vacío. No la marca como leída: el contador sigue
     * visible hasta que se hace clic, igual que antes.
     */
    const selectedConversationId =
      ui.selectedConversationId && workspace.conversations[ui.selectedConversationId]
        ? ui.selectedConversationId
        : (Object.keys(workspace.conversations)[0] ?? null);

    return {
      state: { ...workspace, ...ui, selectedConversationId },
      dispatch: inboxDispatch,
      sendMedia: (file: File, caption?: string) => {
        return sendMedia(selectedConversationId ?? '', file, caption ?? '');
      },
    };
  }, [workspace, ui, inboxDispatch, sendMedia]);

  if (!value) return <>{fallback}</>;
  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}
