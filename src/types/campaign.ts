/**
 * Campaña: un envío único de una plantilla de WhatsApp a un conjunto de
 * contactos elegibles. No es secuencia, no es multicanal, no se repite.
 */
export type CampaignStatus = 'draft' | 'scheduled' | 'completed' | 'failed' | 'cancelled';

export type CampaignAudienceType = 'all' | 'tag' | 'stage' | 'manual';

export interface CampaignAudience {
  type: CampaignAudienceType;
  tagId?: string;
  stageId?: string;
}

/**
 * Cómo se rellena cada variable de la plantilla. En este MVP solo dos fuentes:
 * un valor fijo igual para todos, o el nombre del contacto (personalizado).
 */
export type TemplateVariableMapping =
  | { source: 'fixed'; value: string }
  | { source: 'contact_name' };

export interface CampaignMetrics {
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  audience: CampaignAudience;
  /** Snapshot congelado al confirmar: cambios posteriores no lo alteran. */
  recipientIds: string[];
  /** Clave de variable → cómo rellenarla. */
  variableMappings: Record<string, TemplateVariableMapping>;
  createdAt: string;
  scheduledAt: string | null;
  createdBy: string;
  metrics: CampaignMetrics;
}
