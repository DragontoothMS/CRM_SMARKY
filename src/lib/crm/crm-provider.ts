/**
 * Contrato de operaciones de CRM sobre conversaciones y contactos.
 * Solo la interfaz: sin implementación, sin persistencia, sin red.
 *
 * Hoy estas acciones las resuelve el reducer del Inbox contra datos mock
 * (src/modules/inbox/state). Esta interfaz documenta a dónde se moverán.
 */
export interface CRMProvider {
  addTag(...args: unknown[]): Promise<unknown>;
  removeTag(...args: unknown[]): Promise<unknown>;
  updateStage(...args: unknown[]): Promise<unknown>;
  addNote(...args: unknown[]): Promise<unknown>;
  archiveConversation(...args: unknown[]): Promise<unknown>;
}
