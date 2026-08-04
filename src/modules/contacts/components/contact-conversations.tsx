'use client';

import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import { formatRelativeShort } from '@/lib/format';
import { StageBadge } from '@/components/common/stage-badge';
import type { PipelineStage } from '@/types';
import type { ContactConversationSummary } from '../utils/contact-summary';

interface ContactConversationsProps {
  conversations: ContactConversationSummary[];
  stage?: PipelineStage;
  now: string;
}

/**
 * Preparada para varias conversaciones aunque hoy los mocks tengan una por
 * contacto. El estado de IA se muestra acá, por conversación, que es a lo que
 * realmente pertenece.
 */
export function ContactConversations({ conversations, stage, now }: ContactConversationsProps) {
  if (conversations.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Este contacto todavía no tiene conversaciones.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {conversations.map(({ conversation, aiEnabled }) => {
        const meta = CHANNEL_META[conversation.channel];
        const Icon = meta.icon;

        return (
          <li key={conversation.id}>
            <Link
              href={`/inbox?c=${conversation.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:border-primary/40 hover:bg-secondary/60"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg',
                  meta.badgeClass,
                )}
                aria-hidden
              >
                <Icon className="size-4 text-white" />
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {meta.label}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeShort(conversation.lastMessageAt, now)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {stage && <StageBadge stage={stage} />}
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
                      aiEnabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-muted-foreground',
                    )}
                  >
                    <Sparkles className="size-2.5" />
                    {aiEnabled ? 'IA activa' : 'IA desactivada'}
                  </span>
                </div>
              </div>

              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
