'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workspaceReducer } from './workspace-reducer';
import type { WorkspaceAction, WorkspaceState } from './workspace-types';
import { adaptKapsoToSeedData } from '@/lib/kapso-adapter';
import type { KapsoMessage } from '@/lib/kapso-adapter';
import { CONVERSATIONS_QUERY_KEY, fetchConversations } from '@/lib/inbox-data';

const FULL_POLL = 10000;   // 10s: lista completa
const ACTIVE_POLL = 3000;   // 3s: solo la conversación activa

interface WorkspaceContextValue {
  state: WorkspaceState | null;
  dispatch: React.Dispatch<WorkspaceAction>;
  ready: boolean;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  sendMedia: (conversationId: string, file: File, caption?: string) => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, null);
  const [ready, setReady] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const hydrated = useRef(false);

  // useQuery con refetchInterval = 10s — exactamente como el oficial
  const { data: kapsoConversations = [] } = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: fetchConversations,
    refetchInterval: FULL_POLL,
  });

  // Hydratación inicial
  useEffect(() => {
    if (hydrated.current || !kapsoConversations.length) return;
    hydrated.current = true;

    async function load() {
      try {
        const allMessages: Record<string, KapsoMessage[]> = {};
        await Promise.all(
          kapsoConversations.slice(0, 50).map(async (conv) => {
            try {
              const params = new URLSearchParams({ limit: '50' });
              if (conv.phoneNumberId) params.set('phoneNumberId', conv.phoneNumberId);
              const res = await fetch(`/api/messages/${conv.id}?${params.toString()}`);
              if (res.ok) {
                const data = await res.json();
                allMessages[conv.id] = (data.data ?? []) as KapsoMessage[];
              }
            } catch { /* silencioso */ }
          }),
        );

        const now = new Date().toISOString();
        const seedData = adaptKapsoToSeedData(
          kapsoConversations as Parameters<typeof adaptKapsoToSeedData>[0],
          allMessages,
          now,
        );
        dispatch({ type: 'HYDRATE', payload: seedData });
        setReady(true);
      } catch {
        setReady(true);
      }
    }

    load();
  }, [kapsoConversations]);

  // Full poll: cada 10s
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(async () => {
      try {
        const msgs: Record<string, KapsoMessage[]> = {};
        await Promise.all(
          kapsoConversations.slice(0, 30).map(async (conv) => {
            try {
              const params = new URLSearchParams({ limit: '10' });
              if (conv.phoneNumberId) params.set('phoneNumberId', conv.phoneNumberId);
              const res = await fetch(`/api/messages/${conv.id}?${params.toString()}`);
              if (res.ok) {
                const data = await res.json();
                if (data.data?.length) msgs[conv.id] = data.data as KapsoMessage[];
              }
            } catch { /* silencioso */ }
          }),
        );

        const seed = adaptKapsoToSeedData(
          kapsoConversations as Parameters<typeof adaptKapsoToSeedData>[0],
          msgs,
          new Date().toISOString(),
        );
        dispatch({
          type: 'REFRESH_CONVERSATIONS',
          payload: { conversations: seed.conversations, messages: seed.messages, contacts: seed.contacts },
        });
      } catch { /* silencioso */ }
    }, FULL_POLL);
    return () => clearInterval(interval);
  }, [ready, kapsoConversations]);

  // Fast poll: cada 3s solo la conversación activa
  useEffect(() => {
    if (!ready || !activeConvId) return;
    const conv = state?.conversations[activeConvId];
    const externalId = conv?.externalConversationId;
    if (!externalId) return;

    const interval = setInterval(async () => {
      try {
        const params = new URLSearchParams({ limit: '50' });
        const res = await fetch(`/api/messages/${externalId}?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        const msgs = (data.data ?? []) as KapsoMessage[];
        if (!msgs.length) return;

        const seed = adaptKapsoToSeedData(
          [] as any,
          { [externalId]: msgs },
          new Date().toISOString(),
        );
        dispatch({
          type: 'REFRESH_CONVERSATIONS',
          payload: { conversations: seed.conversations, messages: seed.messages, contacts: seed.contacts },
        });
      } catch { /* silencioso */ }
    }, ACTIVE_POLL);
    return () => clearInterval(interval);
  }, [ready, activeConvId, state?.conversations[activeConvId ?? '']?.externalConversationId]);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    const currentState = state;
    if (!currentState) return;
    const conv = currentState.conversations[conversationId];
    if (!conv) return;
    const contact = currentState.contacts[conv.contactId];
    const to = contact?.phone || '';
    if (!to) return;

    // Agregar mensaje localmente (optimista) con ID temporal
    const localId = crypto.randomUUID();
    dispatch({
      type: 'SEND_MESSAGE',
      conversationId,
      text,
      messageId: localId,
      createdAt: new Date().toISOString(),
    });

    // Enviar por API Kapso
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body: text, type: 'text' }),
      });
      if (res.ok) {
        const data = await res.json();
        const kapsoMsgId = data?.messages?.[0]?.id;
        if (kapsoMsgId) {
          dispatch({
            type: 'UPDATE_MESSAGE_ID',
            conversationId,
            oldId: localId,
            newId: kapsoMsgId,
            externalId: kapsoMsgId,
          });
        }
      }
    } catch { /* API falló, el mensaje queda como local */ }
  }, [state, dispatch]);

  const sendMedia = useCallback(async (
    conversationId: string,
    file: File,
    caption = '',
  ) => {
    const currentState = state;
    if (!currentState) return;
    const conv = currentState.conversations[conversationId];
    if (!conv) return;
    const contact = currentState.contacts[conv.contactId];
    const to = contact?.phone || '';
    if (!to) return;

    const localId = crypto.randomUUID();
    const mediaUrl = URL.createObjectURL(file);
    const createdAt = new Date().toISOString();

    dispatch({
      type: 'SEND_MEDIA',
      conversationId,
      text: caption,
      mediaUrl,
      contentType: 'image',
      fileName: file.name,
      messageId: localId,
      createdAt,
    });

    // 1. Subir archivo a CRM (endpoint temporal)
    let mediaId = '';
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        mediaId = uploadData.mediaId || '';
      }
    } catch { /* upload falló, intenta directo con Kapso */ }

    // 2. Enviar por Kapso
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          body: caption || '',
          type: 'image',
          ...(mediaId ? { mediaId } : {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const kapsoMsgId = data?.messages?.[0]?.id;
        if (kapsoMsgId) {
          dispatch({
            type: 'UPDATE_MESSAGE_ID',
            conversationId,
            oldId: localId,
            newId: kapsoMsgId,
            externalId: kapsoMsgId,
          });
        }
      }
    } catch { /* API falló */ }
    finally {
      URL.revokeObjectURL(mediaUrl);
    }
  }, [state, dispatch]);

  const value = useMemo(
    () => ({ state, dispatch, ready, sendMessage, sendMedia, setActiveConversationId: setActiveConvId }),
    [state, ready, sendMessage, sendMedia],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace debe usarse dentro de <WorkspaceProvider>');
  return context;
}