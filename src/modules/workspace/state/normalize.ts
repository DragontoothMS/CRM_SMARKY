import type { SeedData } from '@/mocks';
import type { InternalNote } from '@/types';
import type { WorkspaceState } from './workspace-types';

function indexById<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function groupNotes(notes: InternalNote[]): Record<string, InternalNote[]> {
  const grouped: Record<string, InternalNote[]> = {};
  for (const note of notes) {
    (grouped[note.conversationId] ??= []).push(note);
  }
  for (const list of Object.values(grouped)) {
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return grouped;
}

/**
 * Convierte el seed en el estado de dominio del workspace.
 *
 * `indexById` preserva el orden del seed, así que quien necesite "la primera
 * conversación" puede tomar la primera clave.
 */
export function normalizeSeed(seed: SeedData): WorkspaceState {
  return {
    workspace: seed.workspace,
    seededAt: seed.seededAt,
    contacts: indexById(seed.contacts),
    conversations: indexById(seed.conversations),
    messagesByConversation: seed.messages,
    notesByConversation: groupNotes(seed.notes),
    tags: indexById(seed.tags),
    stages: indexById(seed.stages),
    channelAccounts: indexById(seed.channelAccounts),
    templates: indexById(seed.templates),
    campaigns: indexById(seed.campaigns),
  };
}
