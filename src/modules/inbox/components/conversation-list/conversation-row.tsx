'use client';

import { cn } from '@/lib/utils';
import { formatRelativeShort, truncate } from '@/lib/format';
import { ChannelAvatar } from '@/components/common/channel-avatar';
import { StageBadge } from '@/components/common/stage-badge';
import { TagBadgeList } from '@/components/common/tag-badge-list';
import type { Tag } from '@/types';
import type { ConversationRowData } from '../../hooks/use-visible-conversations';

interface ConversationRowProps {
  data: ConversationRowData;
  tags: Tag[];
  isSelected: boolean;
  now: string;
  onSelect: () => void;
}

export function ConversationRow({ data, tags, isSelected, now, onSelect }: ConversationRowProps) {
  const { conversation, contact, stage, preview } = data;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(
        'relative flex w-full items-start gap-3 px-4 py-2 text-left transition-colors',
        // El separador arranca después del avatar: evita el efecto tabla.
        'after:absolute after:inset-x-0 after:bottom-0 after:ml-[60px] after:h-px after:bg-border',
        isSelected ? 'bg-secondary' : 'hover:bg-secondary/60',
      )}
    >
      {/* Indicador de selección */}
      {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-primary" aria-hidden />}

      <ChannelAvatar name={contact.name} channel={conversation.channel} size={44} />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              'truncate text-[15px] text-foreground',
              conversation.unreadCount > 0 ? 'font-semibold' : 'font-medium',
            )}
          >
            {contact.name}
          </span>
          {/* Hora y no leídos juntos: un solo punto de lectura para la urgencia. */}
          <span className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                'text-xs',
                conversation.unreadCount > 0
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground',
              )}
            >
              {formatRelativeShort(conversation.lastMessageAt, now)}
            </span>
            {/* El contador solo existe si el dato lo trae. */}
            {conversation.unreadCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {conversation.unreadCount}
              </span>
            )}
          </span>
        </div>

        <p
          className={cn(
            'truncate text-sm/tight',
            conversation.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {truncate(preview, 58)}
        </p>

        <div className="flex items-center gap-1.5">
          {stage && <StageBadge stage={stage} />}
          <TagBadgeList tags={tags} max={2} />
        </div>
      </div>
    </button>
  );
}
