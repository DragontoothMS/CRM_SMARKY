import type { InboxUiAction, InboxUiState } from './inbox-types';

const STORAGE_KEY = 'smarky_inbox_ui';

export function loadPersistedState(): InboxUiState {
  if (typeof window === 'undefined') {
    return { selectedConversationId: null, filters: { channel: 'all', tagId: null, stageId: null, search: '' } };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        selectedConversationId: parsed.selectedConversationId ?? null,
        filters: {
          channel: parsed.filters?.channel ?? 'all',
          tagId: parsed.filters?.tagId ?? null,
          stageId: parsed.filters?.stageId ?? null,
          search: parsed.filters?.search ?? '',
        },
      };
    }
  } catch { /* ignorar */ }
  return { selectedConversationId: null, filters: { channel: 'all', tagId: null, stageId: null, search: '' } };
}

function persistState(state: InboxUiState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedConversationId: state.selectedConversationId,
      filters: state.filters,
    }));
  } catch { /* ignorar */ }
}

export const INITIAL_UI_STATE: InboxUiState = {
  selectedConversationId: null,
  filters: { channel: 'all', tagId: null, stageId: null, search: '' },
};

/** Acción interna: la selección la aplica la fachada, no los componentes. */
export type InboxUiInternalAction =
  | InboxUiAction
  | { type: 'SELECT'; conversationId: string | null };

/**
 * Solo estado visual del inbox. Las mutaciones de dominio viven en
 * workspace-reducer, para que Contactos y Pipeline vean los mismos datos.
 */
export function inboxUiReducer(state: InboxUiState, action: InboxUiInternalAction): InboxUiState {
  let next: InboxUiState;
  switch (action.type) {
    case 'SELECT':
      next = { ...state, selectedConversationId: action.conversationId };
      break;
    case 'SET_CHANNEL_FILTER':
      next = { ...state, filters: { ...state.filters, channel: action.channel } };
      break;
    case 'SET_TAG_FILTER':
      next = { ...state, filters: { ...state.filters, tagId: action.tagId } };
      break;
    case 'SET_STAGE_FILTER':
      next = { ...state, filters: { ...state.filters, stageId: action.stageId } };
      break;
    case 'SET_SEARCH':
      next = { ...state, filters: { ...state.filters, search: action.search } };
      break;
    default:
      return state;
  }
  persistState(next);
  return next;
}