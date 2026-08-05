import type {
  Campaign,
  CampaignAudience,
  CampaignStatus,
  ChannelAccount,
  Contact,
  Conversation,
  InternalNote,
  Message,
  PipelineStage,
  Tag,
  TemplateCategory,
  TemplateVariable,
  TemplateVariableMapping,
  WhatsAppTemplate,
  Workspace,
} from '@/types';
import type { SeedData } from '@/mocks';

/**
 * Datos de dominio del workspace, compartidos por todos los módulos.
 *
 * Aquí no vive nada visual: la conversación seleccionada, los filtros o el
 * drawer abierto son estado de cada módulo. Este provider solo guarda lo que,
 * si se duplicara, produciría incoherencias entre pantallas.
 *
 * Normalizado por id: mutar un contacto no obliga a recorrer arrays, y todas
 * las vistas que lo leen por id se actualizan solas.
 */
export interface WorkspaceState {
  workspace: Workspace;
  /** `now` del seed. Todas las fechas relativas se calculan contra este valor. */
  seededAt: string;
  contacts: Record<string, Contact>;
  conversations: Record<string, Conversation>;
  messagesByConversation: Record<string, Message[]>;
  notesByConversation: Record<string, InternalNote[]>;
  tags: Record<string, Tag>;
  stages: Record<string, PipelineStage>;
  channelAccounts: Record<string, ChannelAccount>;
  templates: Record<string, WhatsAppTemplate>;
  campaigns: Record<string, Campaign>;
}

/** Datos que el wizard confirma; el reducer arma la Campaign completa. */
export interface CreateCampaignInput {
  id: string;
  name: string;
  templateId: string;
  audience: CampaignAudience;
  recipientIds: string[];
  variableMappings: Record<string, TemplateVariableMapping>;
  /** 'draft' guarda borrador; 'scheduled' exige scheduledAt. */
  status: Extract<CampaignStatus, 'draft' | 'scheduled'>;
  scheduledAt: string | null;
  createdAt: string;
}

/** Campos editables de un draft. El reducer rechaza editar cualquier otro estado. */
export interface UpdateCampaignInput {
  id: string;
  name?: string;
  templateId?: string;
  audience?: CampaignAudience;
  recipientIds?: string[];
  variableMappings?: Record<string, TemplateVariableMapping>;
  /** Pasar a 'scheduled' confirma el borrador; requiere scheduledAt. */
  status?: Extract<CampaignStatus, 'draft' | 'scheduled'>;
  scheduledAt?: string | null;
}

/** Datos que crea un borrador; el reducer arma la WhatsAppTemplate completa. */
export interface CreateTemplateInput {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  body: string;
  variables: TemplateVariable[];
  createdAt: string;
}

/** Campos editables de un borrador/rechazada. El reducer rechaza otros estados. */
export interface UpdateTemplateInput {
  id: string;
  name?: string;
  category?: TemplateCategory;
  language?: string;
  body?: string;
  variables?: TemplateVariable[];
  updatedAt: string;
}

export type WorkspaceAction =
  | { type: 'HYDRATE'; payload: SeedData }
  | { type: 'REFRESH_CONVERSATIONS'; payload: { conversations: Conversation[]; messages: Record<string, Message[]>; contacts?: Contact[] } }
  /** Abrir una conversación la marca como leída: es dominio, no selección visual. */
  | { type: 'MARK_CONVERSATION_READ'; conversationId: string }
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
      text: string;
      mediaUrl: string;
      contentType: 'image' | 'video' | 'audio' | 'document';
      fileName?: string;
      messageId: string;
      createdAt: string;
    }
  | { type: 'TOGGLE_AI'; conversationId: string }
  | { type: 'ADD_TAG'; contactId: string; tagId: string }
  | { type: 'REMOVE_TAG'; contactId: string; tagId: string }
  | { type: 'SET_STAGE'; contactId: string; stageId: string }
  | { type: 'ADD_NOTE'; conversationId: string; body: string; noteId: string; createdAt: string }
  | { type: 'UPDATE_MESSAGE_ID'; conversationId: string; oldId: string; newId: string; externalId: string }
  | { type: 'CREATE_CAMPAIGN'; payload: CreateCampaignInput }
  | { type: 'UPDATE_CAMPAIGN'; payload: UpdateCampaignInput }
  | { type: 'CANCEL_CAMPAIGN'; campaignId: string }
  | { type: 'CREATE_TEMPLATE'; payload: CreateTemplateInput }
  | { type: 'UPDATE_TEMPLATE'; payload: UpdateTemplateInput }
  | { type: 'SUBMIT_TEMPLATE'; templateId: string; submittedAt: string }
  | { type: 'DUPLICATE_TEMPLATE'; templateId: string; newId: string; createdAt: string }
  | { type: 'DISABLE_TEMPLATE'; templateId: string; updatedAt: string }
  | { type: 'ENABLE_TEMPLATE'; templateId: string; updatedAt: string }
  | { type: 'DELETE_TEMPLATE'; templateId: string; updatedAt: string }
  | { type: 'RESTORE_TEMPLATE'; templateId: string; updatedAt: string };
