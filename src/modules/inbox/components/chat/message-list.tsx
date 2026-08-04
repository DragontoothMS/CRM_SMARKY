'use client';

import { useEffect, useRef } from 'react';
import { formatDateSeparator } from '@/lib/format';
import type { Message } from '@/types';
import { groupMessages } from '../../utils/group-messages';
import { DateSeparator } from './date-separator';
import { MessageBubble } from './message-bubble';

export function MessageList({ messages, now }: { messages: Message[]; now: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const days = groupMessages(messages);

  // Baja al último mensaje al abrir la conversación y al enviar.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {days.map((day) => (
          <div key={day.day}>
            <DateSeparator label={formatDateSeparator(day.day, now)} />
            {/* Ráfagas del mismo autor quedan pegadas; entre grupos hay aire. */}
            {day.groups.map((group) => (
              <div key={group.id} className="mt-3 space-y-0.5">
                {group.messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isFirst={index === 0}
                    isLast={index === group.messages.length - 1}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
