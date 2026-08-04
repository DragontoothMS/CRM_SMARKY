import { Bot, Headset } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/format';
import type { Message } from '@/types';
import { MessageStatus } from './message-status';
import { TextContent } from './content/text-content';
import { DocumentContent } from './content/document-content';
import { SystemContent } from './content/system-content';
import {
  AudioContent,
  ImageContent,
  StickerContent,
  VideoContent,
} from './content/media-content';

/** El switch es exhaustivo: agregar un contentType al tipo rompe el build acá. */
function MessageContent({ message }: { message: Message }) {
  switch (message.contentType) {
    case 'image':
      return <ImageContent message={message} />;
    case 'video':
      return <VideoContent message={message} />;
    case 'audio':
      return <AudioContent message={message} />;
    case 'document':
      return <DocumentContent message={message} />;
    case 'sticker':
      return <StickerContent message={message} />;
    case 'system':
      return <SystemContent message={message} />;
    case 'text':
    case 'template':
      return <TextContent message={message} />;
  }
}

/** Distintivo de autor. Solo cuando el mock lo declara: nunca se infiere. */
function SenderBadge({ senderType }: { senderType: Message['senderType'] }) {
  if (senderType === 'ai') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium opacity-70">
        <Bot className="size-3" />
        IA
      </span>
    );
  }
  if (senderType === 'human') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium opacity-70">
        <Headset className="size-3" />
        Asesor
      </span>
    );
  }
  return null;
}

interface MessageBubbleProps {
  message: Message;
  /** Primero del grupo: lleva el badge de autor. */
  isFirst?: boolean;
  /** Último del grupo: lleva hora y estado de entrega. */
  isLast?: boolean;
}

export function MessageBubble({ message, isFirst = true, isLast = true }: MessageBubbleProps) {
  // Sistema y sticker se renderizan sueltos, sin burbuja.
  if (message.contentType === 'system') return <MessageContent message={message} />;

  const isOutbound = message.direction === 'outbound';
  // Un mensaje fallido siempre muestra su estado, aunque esté en medio de un grupo.
  const showMeta = isLast || message.status === 'failed';

  if (message.contentType === 'sticker') {
    return (
      <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
        <div className="space-y-1">
          <MessageContent message={message} />
          <div className="flex justify-end gap-1 text-[11px] text-muted-foreground">
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[min(75%,32rem)] rounded-2xl px-3 py-2 shadow-xs',
          isOutbound
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-surface text-foreground',
          // La esquina "de cola" solo la lleva el último del grupo.
          isLast && (isOutbound ? 'rounded-br-sm' : 'rounded-bl-sm'),
        )}
      >
        {isFirst && isOutbound && message.senderType !== 'human' && (
          <div className="mb-1">
            <SenderBadge senderType={message.senderType} />
          </div>
        )}
        <MessageContent message={message} />
        {showMeta && (
          <div
            className={cn(
              'mt-1 flex items-center justify-end gap-1 text-[11px]',
              isOutbound ? 'text-primary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {isFirst && isOutbound && message.senderType === 'human' && (
              <SenderBadge senderType="human" />
            )}
            <span>{formatTime(message.createdAt)}</span>
            {message.status && <MessageStatus status={message.status} />}
          </div>
        )}
      </div>
    </div>
  );
}
