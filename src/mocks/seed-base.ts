import type { ChannelAccount, PipelineStage, Tag, Workspace } from '@/types';
import { daysAgo } from './seed-helpers';

/** Workspace único de la demo. No hay selector ni multitenancy real todavía. */
export const WORKSPACE_ID = 'workspace_smarky_demo';

export function createWorkspace(now: Date): Workspace {
  return {
    id: WORKSPACE_ID,
    name: 'Smarky Demo',
    slug: 'smarky-demo',
    createdAt: daysAgo(now, 120),
  };
}

export const TAGS: Tag[] = [
  { id: 'tag_nuevo', workspaceId: WORKSPACE_ID, name: 'Nuevo', color: 'teal' },
  { id: 'tag_calificado', workspaceId: WORKSPACE_ID, name: 'Calificado', color: 'blue' },
  { id: 'tag_urgente', workspaceId: WORKSPACE_ID, name: 'Urgente', color: 'rose' },
  { id: 'tag_vip', workspaceId: WORKSPACE_ID, name: 'VIP', color: 'violet' },
  { id: 'tag_soporte', workspaceId: WORKSPACE_ID, name: 'Soporte', color: 'amber' },
  { id: 'tag_mayorista', workspaceId: WORKSPACE_ID, name: 'Mayorista', color: 'slate' },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'stage_nuevo', workspaceId: WORKSPACE_ID, name: 'Nuevo', order: 1, color: 'slate' },
  { id: 'stage_contactado', workspaceId: WORKSPACE_ID, name: 'Contactado', order: 2, color: 'blue' },
  { id: 'stage_calificado', workspaceId: WORKSPACE_ID, name: 'Calificado', order: 3, color: 'amber' },
  { id: 'stage_propuesta', workspaceId: WORKSPACE_ID, name: 'Propuesta', order: 4, color: 'teal' },
  { id: 'stage_ganado', workspaceId: WORKSPACE_ID, name: 'Ganado', order: 5, color: 'green' },
  { id: 'stage_perdido', workspaceId: WORKSPACE_ID, name: 'Perdido', order: 6, color: 'red' },
];

export const CHANNEL_ACCOUNTS: ChannelAccount[] = [
  {
    id: 'acc_wa_01',
    workspaceId: WORKSPACE_ID,
    channel: 'whatsapp',
    name: 'Smarky Ventas',
    externalAccountId: 'demo-wa-0001',
    status: 'connected',
  },
  {
    id: 'acc_ig_01',
    workspaceId: WORKSPACE_ID,
    channel: 'instagram',
    name: '@smarky.app',
    externalAccountId: 'demo-ig-0001',
    status: 'connected',
  },
  {
    id: 'acc_ms_01',
    workspaceId: WORKSPACE_ID,
    channel: 'messenger',
    name: 'Smarky',
    externalAccountId: 'demo-ms-0001',
    status: 'connected',
  },
];
