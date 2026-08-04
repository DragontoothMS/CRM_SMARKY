/**
 * Contrato de control del agente de IA por conversación.
 * Solo la interfaz: sin implementación, sin proveedor de modelo, sin red.
 *
 * setConversationAI vive acá y no en MessagingProvider: activar o desactivar el
 * agente es una decisión del dominio de IA, no del transporte de mensajes.
 *
 * Futuro destino del switch "Respuesta con IA":
 *   POST /api/conversations/:id/ai-control
 * (el endpoint no existe todavía; hoy el switch solo muta estado local).
 */
export interface AIProvider {
  setConversationAI(...args: unknown[]): Promise<unknown>;
  getConversationAIStatus(...args: unknown[]): Promise<unknown>;
}
