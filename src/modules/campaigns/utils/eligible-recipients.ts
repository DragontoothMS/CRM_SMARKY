import type { Campaign, CampaignAudience, Contact } from '@/types';

/** Un contacto es elegible solo si tiene identidad de WhatsApp. */
export function hasWhatsApp(contact: Contact): boolean {
  return contact.channelIdentities.some((identity) => identity.channel === 'whatsapp');
}

export interface RecipientCandidate {
  contact: Contact;
  eligible: boolean;
  /** Motivo de exclusión, cuando no es elegible. */
  reason?: string;
}

/** Aplica el segmento (sin filtrar por WhatsApp todavía). */
function matchesSegment(contact: Contact, audience: CampaignAudience): boolean {
  switch (audience.type) {
    case 'all':
    case 'manual':
      return true;
    case 'tag':
      return audience.tagId ? contact.tagIds.includes(audience.tagId) : false;
    case 'stage':
      return audience.stageId ? contact.stageId === audience.stageId : false;
    default:
      return false;
  }
}

/**
 * Resuelve la audiencia mostrando incluidos y excluidos, en este orden:
 *   1. tomar contactos del workspace
 *   2. aplicar el segmento
 *   3. validar identidad de WhatsApp
 *   4. marcar (no ocultar) los no elegibles con su motivo
 *
 * Para 'manual' el segmento no filtra: se muestran todos los contactos y el
 * llamador decide la selección, pero los sin WhatsApp quedan igual deshabilitados.
 */
export function resolveCandidates(
  contacts: Contact[],
  audience: CampaignAudience,
): RecipientCandidate[] {
  return contacts
    .filter((contact) => matchesSegment(contact, audience))
    .map((contact) => {
      const eligible = hasWhatsApp(contact);
      return eligible
        ? { contact, eligible }
        : { contact, eligible, reason: 'Sin identidad de WhatsApp' };
    });
}

/**
 * IDs que se guardan como snapshot al confirmar. Para un segmento, son todos los
 * elegibles; para manual, la intersección de la selección con los elegibles.
 */
export function resolveRecipientIds(
  contacts: Contact[],
  audience: CampaignAudience,
  manualSelection: string[] = [],
): string[] {
  if (audience.type === 'manual') {
    const selected = new Set(manualSelection);
    return contacts
      .filter((contact) => selected.has(contact.id) && hasWhatsApp(contact))
      .map((contact) => contact.id);
  }
  return resolveCandidates(contacts, audience)
    .filter((candidate) => candidate.eligible)
    .map((candidate) => candidate.contact.id);
}

export interface AudienceSummary {
  included: number;
  excluded: number;
}

export function summarizeCandidates(candidates: RecipientCandidate[]): AudienceSummary {
  return {
    included: candidates.filter((c) => c.eligible).length,
    excluded: candidates.filter((c) => !c.eligible).length,
  };
}

/** Destinatarios de una campaña ya creada, para el detalle. */
export function campaignRecipients(campaign: Campaign, contactsById: Record<string, Contact>): Contact[] {
  return campaign.recipientIds
    .map((id) => contactsById[id])
    .filter((contact): contact is Contact => Boolean(contact));
}
