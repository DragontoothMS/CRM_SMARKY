'use client';

import { useState, useRef } from 'react';
import { Paperclip, Music, SendHorizonal, X } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const windowClosed = sessionWindow.applies && !sessionWindow.isOpen;
  const canSend = text.trim().length > 0 && !windowClosed;
  const canSendImage = selectedImage !== null && !windowClosed;
  const canSendAudio = selectedAudio !== null && !windowClosed;

  function handleSend() {
    if (!canSend) return;
    dispatch({
      type: 'SEND_MESSAGE',
      conversationId,
      text: text.trim(),
      messageId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setText('');
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  }

  function handleAudioSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file);
    }
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemoveAudio() {
    setSelectedAudio(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  }

  async function handleSendImage() {
    if (!selectedImage || !canSendImage) return;
    dispatch({
      type: 'SEND_MEDIA' as const,
      conversationId,
      file: selectedImage,
      caption: text.trim(),
    });
    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSendAudio() {
    if (!selectedAudio || !canSendAudio) return;
    dispatch({
      type: 'SEND_MEDIA' as const,
      conversationId,
      file: selectedAudio,
      caption: text.trim(),
    });
    setText('');
    setSelectedAudio(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  }

  return (
    <div className="space-y-2 border-t border-border bg-surface px-4 py-3 sm:px-6">
      {windowClosed && <SessionWindowNotice hours={sessionWindow.hoursSinceLastInbound} />}
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={windowClosed}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-[18px]" />
                <span className="sr-only">Adjuntar imagen</span>
              </Button>
            }
          />
          <TooltipContent>Adjuntar imagen</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={windowClosed}
                onClick={() => audioInputRef.current?.click()}
              >
                <Music className="size-[18px]" />
                <span className="sr-only">Adjuntar audio</span>
              </Button>
            }
          />
          <TooltipContent>Adjuntar audio</TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioSelect}
          className="hidden"
        />

        {/* Fuera de la ventana de 24 h la plantilla es la única acción habilitada. */}
        <TemplatePicker onSelect={(body) => setText(body)} />

        {selectedImage && (
          <div className="relative h-16 w-16 rounded-lg border border-border">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="preview"
              className="h-full w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
        {selectedAudio && (
          <div className="relative flex items-center gap-2 rounded-lg border border-border px-2 py-1.5">
            <Music className="size-4 text-muted-foreground" />
            <span className="max-w-[8rem] truncate text-xs">{selectedAudio.name}</span>
            <button
              type="button"
              onClick={handleRemoveAudio}
              className="rounded-full bg-destructive p-0.5 text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (selectedImage) {
                handleSendImage();
              } else {
                handleSend();
              }
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
          onClick={selectedAudio ? handleSendAudio : selectedImage ? handleSendImage : handleSend}
          disabled={selectedAudio ? !canSendAudio : selectedImage ? !canSendImage : !canSend}
        >
          <SendHorizonal className="size-[18px]" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </div>
  );
}
