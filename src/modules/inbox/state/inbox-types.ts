import type { Channel } from '@/types';
import type { SeedData } from '@/mocks';
import type { WorkspaceState } from '@/modules/workspace/state/workspace-types';

export type ChannelFilter = Channel | 'all';

export interface InboxFilters {
  channel: ChannelFilter;
  tagId: string | null;
  stageId: string | null;
  search: string;
}

/** Lo único que el Inbox posee: es visual y no tiene sentido fuera de esta pantalla. */
export interface InboxUiState {
  selectedConversationId: string | null;
  filters: InboxFilters;
}

/**
 * Shape que ven los componentes: dominio del workspace + UI del inbox.
 *
 * Se mantiene idéntico al de antes del estado compartido, para que los
 * consumidores de useInbox() no tengan que cambiar.
 */
export type InboxState = WorkspaceState & InboxUiState;

/** Acciones que mutan datos compartidos: se enrutan al WorkspaceProvider. */
export type InboxDomainAction =
  | { type: 'HYDRATE'; payload: SeedData }
  | {
      type: 'SEND_MESSAGE';
      conversationId: string;
      text: string;
      messageId: string;
      createdAt: string;
    }
  | {
      type: 'SEND_MEDIA';
      conversationId: string;
      file: File;
      caption: string;
    }
  | { type: 'TOGGLE_AI'; conversationId: string }
  | { type: 'ADD_TAG'; contactId: string; tagId: string }
  | { type: 'REMOVE_TAG'; contactId: string; tagId: string }
  | { type: 'SET_STAGE'; contactId: string; stageId: string }
  | { type: 'ADD_NOTE'; conversationId: string; body: string; noteId: string; createdAt: string };

/** Acciones puramente visuales: se quedan en el módulo. */
export type InboxUiAction =
  | { type: 'SET_CHANNEL_FILTER'; channel: ChannelFilter }
  | { type: 'SET_TAG_FILTER'; tagId: string | null }
  | { type: 'SET_STAGE_FILTER'; stageId: string | null }
  | { type: 'SET_SEARCH'; search: string };

/**
 * SELECT_CONVERSATION es mixta: guarda la selección (visual) y marca la
 * conversación como leída (dominio). La fachada la reparte entre ambos
 * reducers; para los componentes sigue siendo una sola acción.
 */
export type InboxAction =
  | InboxDomainAction
  | InboxUiAction
  | { type: 'SELECT_CONVERSATION'; conversationId: string | null };
