import { NextResponse } from 'next/server';
import { whatsappClient } from '@/lib/whatsapp-client';
import { resolvePhoneNumberContext } from '@/lib/inbox-settings';

/**
 * Envío de mensajes a WhatsApp vía Kapso SDK (whatsappClient.messages.*).
 * El SDK construye la URL correcta con graphVersion y adjunta X-API-Key.
 * Media API nativa de Kapso: upload → media_id → sendImage({ image: { id } }).
 */
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      phoneNumberId?: string;
      to: string;
      type?: string;
      body?: string;
      caption?: string;
      mediaId?: string;
      filename?: string;
      preview_url?: boolean;
    };

    if (!payload.to) {
      return NextResponse.json({ error: 'Missing required field: to' }, { status: 400 });
    }

    const phoneNumber = await resolvePhoneNumberContext(payload.phoneNumberId || undefined);
    const phoneNumberId = phoneNumber.phone_number_id;
    const type = payload.type || 'text';

    let data: unknown;

    if (type === 'text') {
      const res = await whatsappClient.messages.sendText({
        phoneNumberId,
        to: payload.to,
        body: payload.body || payload.caption || '',
        previewUrl: payload.preview_url ?? false,
      });
      data = res;
    } else if (type === 'image') {
      if (!payload.mediaId) {
        return NextResponse.json({ error: 'mediaId required for image' }, { status: 400 });
      }
      const res = await whatsappClient.messages.sendImage({
        phoneNumberId,
        to: payload.to,
        image: { id: payload.mediaId, caption: payload.caption || undefined },
      });
      data = res;
    } else if (type === 'video') {
      if (!payload.mediaId) return NextResponse.json({ error: 'mediaId required for video' }, { status: 400 });
      const res = await whatsappClient.messages.sendVideo({
        phoneNumberId,
        to: payload.to,
        video: { id: payload.mediaId, caption: payload.caption || undefined },
      });
      data = res;
    } else if (type === 'document') {
      if (!payload.mediaId) return NextResponse.json({ error: 'mediaId required for document' }, { status: 400 });
      const res = await whatsappClient.messages.sendDocument({
        phoneNumberId,
        to: payload.to,
        document: { id: payload.mediaId, caption: payload.caption || undefined, filename: payload.filename || undefined },
      });
      data = res;
    } else if (type === 'audio') {
      if (!payload.mediaId) return NextResponse.json({ error: 'mediaId required for audio' }, { status: 400 });
      const res = await whatsappClient.messages.sendAudio({
        phoneNumberId,
        to: payload.to,
        audio: { id: payload.mediaId },
      });
      data = res;
    } else {
      return NextResponse.json({ error: `Unsupported type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[messages/send] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
