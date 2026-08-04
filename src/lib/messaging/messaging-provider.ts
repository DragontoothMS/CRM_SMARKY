/**
 * Contrato de transporte de mensajes. Solo la interfaz: no hay implementación,
 * adaptadores ni llamadas de red en esta fase.
 *
 * Enfocado únicamente en enviar mensajes y resolver plantillas. El control de IA
 * por conversación NO vive acá: es responsabilidad de AIProvider (src/lib/ai).
 *
 * Un futuro adaptador (Kapso, Meta, etc.) implementará esta interfaz sin que la
 * UI tenga que cambiar.
 */
export interface MessagingProvider {
  sendText(...args: unknown[]): Promise<unknown>;
  sendMedia(...args: unknown[]): Promise<unknown>;
  sendTemplate(...args: unknown[]): Promise<unknown>;
  getTemplates(...args: unknown[]): Promise<unknown>;
}
