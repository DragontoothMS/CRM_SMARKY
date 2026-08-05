import { Button } from '@/components/ui/button';
import { Play, ZoomIn, X } from 'lucide-react';
import type { Message } from '@/types';
import { useState } from 'react';

/*
 * Imagen, video, audio y sticker.
 * Regla del dominio: la media nunca muestra MIME, tamaño ni nombre de archivo.
 * El filename es exclusivo del documento (ver document-content).
 *
 * Se usa <img> y no next/image a propósito: la media demo son SVG locales, y
 * next/image exige dangerouslyAllowSVG para servirlos.
 */

export function ImageContent({ message }: { message: Message }) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <figure className="relative group space-y-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={message.mediaUrl}
          alt=""
          className="max-h-72 w-full max-w-xs rounded-lg object-cover cursor-pointer transition-opacity group-hover:opacity-90"
          onClick={() => setShowLightbox(true)}
          loading="lazy"
        />
        {message.text && <figcaption className="text-sm whitespace-pre-wrap">{message.text}</figcaption>}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
          onClick={() => setShowLightbox(true)}
        >
          <ZoomIn className="size-4" />
        </Button>
      </figure>

      {showLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowLightbox(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-transparent"
            onClick={() => setShowLightbox(false)}
          >
            <X className="size-6" />
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={message.mediaUrl}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/**
 * Video con render simplificado: preview con overlay de play, sin controles
 * reales. Los assets demo son imágenes, no video; llega en la próxima iteración.
 */
export function VideoContent({ message }: { message: Message }) {
  return (
    <figure className="space-y-1.5">
      <div className="relative w-full max-w-xs overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={message.mediaUrl} alt="" className="max-h-72 w-full object-cover" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-black/55">
            <Play className="size-5 fill-white text-white" />
          </span>
        </span>
      </div>
      {message.text && <figcaption className="text-sm whitespace-pre-wrap">{message.text}</figcaption>}
    </figure>
  );
}

export function AudioContent({ message }: { message: Message }) {
  return (
    <audio controls src={message.mediaUrl} className="h-10 w-64 max-w-full">
      Tu navegador no puede reproducir este audio.
    </audio>
  );
}

/** El sticker se renderiza suelto: quien lo llama no le pone burbuja. */
export function StickerContent({ message }: { message: Message }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={message.mediaUrl} alt="" className="size-28 object-contain" />;
}
