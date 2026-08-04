'use client';

import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { Conversation } from '@/types';
import { useInbox } from '../../hooks/use-inbox';

/**
 * Switch de respuesta automática, independiente por conversación.
 *
 * Hoy solo muta estado local. Cuando exista backend, este handler llamará a
 * AIProvider.setConversationAI → POST /api/conversations/:id/ai-control.
 */
export function AIControlSection({ conversation }: { conversation: Conversation }) {
  const { dispatch } = useInbox();

  return (
    <section className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-muted-foreground" />
            Respuesta con IA
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">El agente responde automáticamente</p>
        </div>
        <Switch
          checked={conversation.aiEnabled}
          onCheckedChange={() => dispatch({ type: 'TOGGLE_AI', conversationId: conversation.id })}
          aria-label="Respuesta con IA"
        />
      </div>
    </section>
  );
}
