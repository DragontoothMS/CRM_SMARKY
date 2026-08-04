import type { Campaign, Message, WhatsAppTemplate } from '@/types';
import { CURRENT_USER, WORKSPACE_ID } from '@/mocks';
import { initialMetrics } from '@/modules/campaigns/utils/campaign-metrics';
import {
  generateCopyName,
  isEditableState,
  meetsSubmitRequirements,
  nameLanguageTaken,
} from '@/modules/templates/utils/template-domain';
import type { WorkspaceAction, WorkspaceState } from './workspace-types';
import { normalizeSeed } from './normalize';

/** Escribe una sola plantilla en el estado, preservando el resto. */
function withTemplate(state: WorkspaceState, template: WhatsAppTemplate): WorkspaceState {
  return { ...state, templates: { ...state.templates, [template.id]: template } };
}

/**
 * Única fuente de mutación del dominio. Todo es local: ninguna acción llama a
 * una API. Cuando exista backend, estas acciones pasarán por CRMProvider,
 * MessagingProvider y AIProvider.
 */
export function workspaceReducer(
  state: WorkspaceState | null,
  action: WorkspaceAction,
): WorkspaceState | null {
  if (action.type === 'HYDRATE') return normalizeSeed(action.payload);
  if (action.type === 'REFRESH_CONVERSATIONS') {
    if (!state) return state;
    const { conversations, messages, contacts: newContacts } = action.payload;
    const convs = { ...state.conversations };
    const msgs = { ...state.messagesByConversation };
    const contactsState = { ...state.contacts };
    let changed = false;
    for (const conv of conversations) {
      const existing = convs[conv.id];
      if (!existing || existing.lastMessageAt !== conv.lastMessageAt || existing.unreadCount !== conv.unreadCount) {
        convs[conv.id] = conv;
        changed = true;
      }
    }
    for (const [convId, messageList] of Object.entries(messages)) {
      const existing = msgs[convId] ?? [];
      const existingIds = new Set(existing.map(m => m.id));
      const existingTexts = new Map<string, number>();
      const now = Date.now();
      for (const m of existing) {
        if (m.direction === 'outbound' && m.text) {
          existingTexts.set(m.text, Date.parse(m.createdAt) || now);
        }
      }
      const newMsgs = messageList.filter(m => {
        if (existingIds.has(m.id)) return false;
        // Evitar duplicados: si es un mensaje saliente con mismo texto y mismo minuto, skip
        if (m.direction === 'outbound' && m.text) {
          const existingTime = existingTexts.get(m.text);
          if (existingTime) {
            const msgTime = Date.parse(m.createdAt);
            if (Math.abs(msgTime - existingTime) < 60000) return false; // misma ventana de 1 min
          }
        }
        return true;
      });
      if (newMsgs.length > 0) {
        msgs[convId] = [...existing, ...newMsgs];
        changed = true;
      }
    }
    // Agregar contactos nuevos
    if (newContacts) {
      for (const c of newContacts) {
        if (!contactsState[c.id]) {
          contactsState[c.id] = c;
          changed = true;
        }
      }
    }
    if (!changed) return state;
    return { ...state, conversations: convs, messagesByConversation: msgs, contacts: contactsState, seededAt: new Date().toISOString() };
  }
  if (!state) return state;

  switch (action.type) {
    case 'MARK_CONVERSATION_READ': {
      const conversation = state.conversations[action.conversationId];
      if (!conversation || conversation.unreadCount === 0) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversationId]: { ...conversation, unreadCount: 0 },
        },
      };
    }

    case 'SEND_MESSAGE': {
      const conversation = state.conversations[action.conversationId];
      if (!conversation) return state;
      const message: Message = {
        id: action.messageId,
        conversationId: action.conversationId,
        channel: conversation.channel,
        direction: 'outbound',
        senderType: 'human',
        contentType: 'text',
        text: action.text,
        status: 'sent',
        createdAt: action.createdAt,
      };
      return {
        ...state,
        messagesByConversation: {
          ...state.messagesByConversation,
          [action.conversationId]: [
            ...(state.messagesByConversation[action.conversationId] ?? []),
            message,
          ],
        },
        conversations: {
          ...state.conversations,
          [action.conversationId]: {
            ...conversation,
            lastMessageId: message.id,
            lastMessageAt: message.createdAt,
          },
        },
      };
    }

    case 'UPDATE_MESSAGE_ID': {
      const { conversationId, oldId, newId, externalId } = action;
      const msgs = state.messagesByConversation[conversationId];
      if (!msgs) return state;
      const idx = msgs.findIndex(m => m.id === oldId);
      if (idx === -1) return state;
      const updated = [...msgs];
      updated[idx] = { ...updated[idx], id: newId, externalMessageId: externalId };
      return {
        ...state,
        messagesByConversation: { ...state.messagesByConversation, [conversationId]: updated },
      };
    }

    case 'TOGGLE_AI': {
      const conversation = state.conversations[action.conversationId];
      if (!conversation) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversationId]: { ...conversation, aiEnabled: !conversation.aiEnabled },
        },
      };
    }

    case 'ADD_TAG':
    case 'REMOVE_TAG': {
      const contact = state.contacts[action.contactId];
      if (!contact) return state;
      const tagIds =
        action.type === 'ADD_TAG'
          ? contact.tagIds.includes(action.tagId)
            ? contact.tagIds
            : [...contact.tagIds, action.tagId]
          : contact.tagIds.filter((id) => id !== action.tagId);
      return {
        ...state,
        contacts: { ...state.contacts, [action.contactId]: { ...contact, tagIds } },
      };
    }

    case 'SET_STAGE': {
      const contact = state.contacts[action.contactId];
      if (!contact || !state.stages[action.stageId]) return state;
      return {
        ...state,
        contacts: {
          ...state.contacts,
          [action.contactId]: { ...contact, stageId: action.stageId },
        },
      };
    }

    case 'ADD_NOTE': {
      const existing = state.notesByConversation[action.conversationId] ?? [];
      return {
        ...state,
        notesByConversation: {
          ...state.notesByConversation,
          // Más recientes primero.
          [action.conversationId]: [
            {
              id: action.noteId,
              workspaceId: WORKSPACE_ID,
              conversationId: action.conversationId,
              authorId: CURRENT_USER.id,
              body: action.body,
              createdAt: action.createdAt,
            },
            ...existing,
          ],
        },
      };
    }

    case 'CREATE_CAMPAIGN': {
      const { payload } = action;
      // El wizard solo confirma draft o scheduled; nunca se simula un envío.
      const campaign: Campaign = {
        id: payload.id,
        workspaceId: WORKSPACE_ID,
        name: payload.name,
        status: payload.status,
        templateId: payload.templateId,
        audience: payload.audience,
        recipientIds: payload.recipientIds,
        variableMappings: payload.variableMappings,
        createdAt: payload.createdAt,
        scheduledAt: payload.status === 'scheduled' ? payload.scheduledAt : null,
        createdBy: CURRENT_USER.id,
        metrics: initialMetrics(payload.recipientIds.length),
      };
      return { ...state, campaigns: { ...state.campaigns, [campaign.id]: campaign } };
    }

    case 'UPDATE_CAMPAIGN': {
      const { payload } = action;
      const current = state.campaigns[payload.id];
      // Solo un borrador se edita. completed, failed, cancelled y scheduled son
      // de solo lectura: la restricción vive acá, no solo en la UI.
      if (!current || current.status !== 'draft') return state;

      const nextStatus = payload.status ?? current.status;
      // Confirmar (draft → scheduled) exige fecha; sin ella, se ignora el cambio.
      if (nextStatus === 'scheduled' && !(payload.scheduledAt ?? current.scheduledAt)) {
        return state;
      }

      const recipientIds = payload.recipientIds ?? current.recipientIds;
      const updated: Campaign = {
        ...current,
        name: payload.name ?? current.name,
        templateId: payload.templateId ?? current.templateId,
        audience: payload.audience ?? current.audience,
        recipientIds,
        variableMappings: payload.variableMappings ?? current.variableMappings,
        status: nextStatus,
        scheduledAt:
          nextStatus === 'scheduled'
            ? (payload.scheduledAt ?? current.scheduledAt)
            : null,
        metrics: initialMetrics(recipientIds.length),
      };
      return { ...state, campaigns: { ...state.campaigns, [updated.id]: updated } };
    }

    case 'CANCEL_CAMPAIGN': {
      const current = state.campaigns[action.campaignId];
      // Solo una campaña programada puede cancelarse; nunca pasa a failed.
      if (!current || current.status !== 'scheduled') return state;
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [current.id]: { ...current, status: 'cancelled', scheduledAt: null },
        },
      };
    }

    case 'CREATE_TEMPLATE': {
      const { payload } = action;
      const templates = Object.values(state.templates);
      // Validación de dominio: sin ella, no se crea nada (ningún registro parcial).
      if (
        payload.name.trim() === '' ||
        payload.language.trim() === '' ||
        !['marketing', 'utility', 'authentication'].includes(payload.category) ||
        nameLanguageTaken(templates, payload.name, payload.language)
      ) {
        return state;
      }
      const template: WhatsAppTemplate = {
        id: payload.id,
        workspaceId: WORKSPACE_ID,
        name: payload.name,
        category: payload.category,
        language: payload.language,
        body: payload.body,
        variables: payload.variables,
        localStatus: 'draft',
        remoteStatus: null,
        syncStatus: 'never_synced',
        rejectionReason: null,
        previousLocalStatus: null,
        createdAt: payload.createdAt,
        updatedAt: payload.createdAt,
        lastSyncedAt: null,
      };
      return withTemplate(state, template);
    }

    case 'UPDATE_TEMPLATE': {
      const { payload } = action;
      const current = state.templates[payload.id];
      // Solo borrador o rechazada se editan; cualquier otro estado es inmutable.
      if (!current || !isEditableState(current)) return state;

      // Unicidad sobre el candidato (name+language ya con los cambios), excluyendo
      // la propia. Si colisiona: mismo estado, sin resetear rejected, sin updatedAt.
      const candidateName = payload.name ?? current.name;
      const candidateLanguage = payload.language ?? current.language;
      if (nameLanguageTaken(Object.values(state.templates), candidateName, candidateLanguage, current.id)) {
        return state;
      }

      const merged: WhatsAppTemplate = {
        ...current,
        name: payload.name ?? current.name,
        category: payload.category ?? current.category,
        language: payload.language ?? current.language,
        body: payload.body ?? current.body,
        variables: payload.variables ?? current.variables,
        updatedAt: payload.updatedAt,
      };
      // Editar una rechazada reinicia su ciclo: vuelve a borrador local puro.
      const reset =
        current.remoteStatus === 'rejected'
          ? {
              localStatus: 'draft' as const,
              remoteStatus: null,
              syncStatus: 'never_synced' as const,
              rejectionReason: null,
              lastSyncedAt: null,
            }
          : null;

      return withTemplate(state, reset ? { ...merged, ...reset } : merged);
    }

    case 'SUBMIT_TEMPLATE': {
      const current = state.templates[action.templateId];
      if (!current || !isEditableState(current)) return state;
      // Requisitos completos + unicidad name+language entre no eliminadas.
      if (
        !meetsSubmitRequirements(current) ||
        nameLanguageTaken(Object.values(state.templates), current.name, current.language, current.id)
      ) {
        return state;
      }
      return withTemplate(state, {
        ...current,
        localStatus: 'active',
        remoteStatus: 'pending',
        syncStatus: 'pending_sync',
        rejectionReason: null,
        updatedAt: action.submittedAt,
        // lastSyncedAt no se inventa aquí: se conserva tal cual.
      });
    }

    case 'DUPLICATE_TEMPLATE': {
      const source = state.templates[action.templateId];
      // Se puede duplicar cualquier plantilla no eliminada.
      if (!source || source.localStatus === 'deleted') return state;
      const copy: WhatsAppTemplate = {
        id: action.newId,
        workspaceId: WORKSPACE_ID,
        name: generateCopyName(Object.values(state.templates), source.name, source.language),
        category: source.category,
        language: source.language,
        body: source.body,
        variables: source.variables,
        // Todo estado remoto y de sincronización se reinicia; el original no se toca.
        localStatus: 'draft',
        remoteStatus: null,
        syncStatus: 'never_synced',
        rejectionReason: null,
        previousLocalStatus: null,
        createdAt: action.createdAt,
        updatedAt: action.createdAt,
        lastSyncedAt: null,
      };
      return withTemplate(state, copy);
    }

    case 'DISABLE_TEMPLATE': {
      const current = state.templates[action.templateId];
      if (!current || current.localStatus !== 'active') return state;
      // Conserva remoteStatus, syncStatus, rejectionReason y lastSyncedAt.
      return withTemplate(state, {
        ...current,
        localStatus: 'disabled',
        updatedAt: action.updatedAt,
      });
    }

    case 'ENABLE_TEMPLATE': {
      const current = state.templates[action.templateId];
      if (!current || current.localStatus !== 'disabled') return state;
      return withTemplate(state, {
        ...current,
        localStatus: 'active',
        updatedAt: action.updatedAt,
      });
    }

    case 'DELETE_TEMPLATE': {
      const current = state.templates[action.templateId];
      // Soft-delete: no se re-elimina una ya eliminada.
      if (!current || current.localStatus === 'deleted') return state;
      return withTemplate(state, {
        ...current,
        // current.localStatus está narrowed a 'draft' | 'active' | 'disabled'.
        previousLocalStatus: current.localStatus,
        localStatus: 'deleted',
        updatedAt: action.updatedAt,
        // remoteStatus y syncStatus intactos.
      });
    }

    case 'RESTORE_TEMPLATE': {
      const current = state.templates[action.templateId];
      if (!current || current.localStatus !== 'deleted') return state;
      // Una eliminada libera su name+language; si otra no eliminada ya lo ocupa,
      // la restauración se rechaza: sigue en papelera, conserva previousLocalStatus,
      // no se renombra ni se toca la plantilla en conflicto.
      if (nameLanguageTaken(Object.values(state.templates), current.name, current.language, current.id)) {
        return state;
      }
      return withTemplate(state, {
        ...current,
        // 'draft' es solo fallback defensivo para datos sembrados sin memoria.
        localStatus: current.previousLocalStatus ?? 'draft',
        previousLocalStatus: null,
        updatedAt: action.updatedAt,
      });
    }

    default:
      return state;
  }
}
