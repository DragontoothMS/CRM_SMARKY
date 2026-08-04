'use client';

import { useState } from 'react';
import { Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInbox } from '../../hooks/use-inbox';
import type { SessionWindow } from '../../hooks/use-session-window';
import { SessionWindowNotice } from './session-window-notice';
import { TemplatePicker } from './template-picker';

export function Composer({
  conversationId,
  sessionWindow,
}: {
  conversationId: string;
  sessionWindow: SessionWindow;
}) {
  const { dispatch } = useInbox();
  const [text, setText] = useState('');

  const windowClosed = sessionWindow.applies && !sessionWindow.isOpen;
  const canSend = text.trim().length > 0 && !windowClosed;

  function handleSend() {
    if (!canSend) return;
    dispatch({
      type: 'SEND_MESSAGE',
      conversationId,
      text: text.trim(),
      // Los ids y el timestamp se generan acá (cliente), nunca durante el render.
      messageId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setText('');
  }

  return (
    <div className="space-y-2 border-t border-border bg-surface px-4 py-3 sm:px-6">
      {windowClosed && <SessionWindowNotice hours={sessionWindow.hoursSinceLastInbound} />}

      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="outline" size="icon" className="size-10 shrink-0" disabled>
                <Paperclip className="size-[18px]" />
                <span className="sr-only">Adjuntar archivo</span>
              </Button>
            }
          />
          <TooltipContent>Adjuntar (pendiente)</TooltipContent>
        </Tooltip>

        {/* Fuera de la ventana de 24 h la plantilla es la única acción habilitada. */}
        <TemplatePicker onSelect={(body) => setText(body)} />

        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          disabled={windowClosed}
          rows={1}
          placeholder={
            windowClosed ? 'Ventana de 24 h cerrada: usá una plantilla' : 'Escribí un mensaje...'
          }
          className="max-h-32 min-h-10 resize-none bg-surface py-2.5"
        />

        <Button
          type="button"
          size="icon"
          className="size-10 shrink-0"
          onClick={handleSend}
          disabled={!canSend}
        >
          <SendHorizonal className="size-[18px]" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </div>
  );
}
