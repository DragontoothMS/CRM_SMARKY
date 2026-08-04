/** Nota interna del equipo. Nunca se muestra como mensaje al contacto. */
export interface InternalNote {
  id: string;
  workspaceId: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;
}
