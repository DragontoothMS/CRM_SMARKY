import { NextResponse } from 'next/server';
import { getKapsoApiKey, resolvePhoneNumberContext } from '@/lib/inbox-settings';

/**
 * Sube un archivo binario a Kapso/WhatsApp Media API usando multipart/form-data:
 *   POST {baseUrl}/{graphVersion}/{phoneNumberId}/media
 *   file    (binary)
 *   type    (MIME: image/png, image/jpeg, etc.)
 * Devuelve el `media_id` de Meta, que luego se pasa a sendImage({ image: { id: media_id } }).
 *
 * NOTA: WhatsApp rechaza subir archivos que ya fueron subidos con el mismo nombre/ídem.
 * El nombre del file es irrelevante para Meta; únicamente el content-type y el binario importan.
 */
const WHATSAPP_BASE_URL = process.env.WHATSAPP_API_URL || 'https://api.kapso.ai/meta/whatsapp';
const GRAPH_VERSION = 'v24.0';

export async function POST(request: Request) {
  const apiKey = getKapsoApiKey();
  const { phone_number_id: phoneNumberId } = await resolvePhoneNumberContext();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || !file.size) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const mediaType = file.type || 'application/octet-stream';
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // WhatsApp Media API: multipart/form-data con 'file' + 'type'
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mediaType }), file.name);
  form.append('type', mediaType);
  form.append('messaging_product', 'whatsapp');

  const uploadUrl = `${WHATSAPP_BASE_URL}/${GRAPH_VERSION}/${phoneNumberId}/media`;

  try {
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: form,
    });

    const result = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error('[media/upload] Kapso upload failed:', uploadRes.status, JSON.stringify(result));
      return NextResponse.json(
        { error: 'Kapso media upload failed', detail: result },
        { status: uploadRes.status },
      );
    }

    const mediaId = (result as { id?: string }).id;

    if (!mediaId) {
      console.error('[media/upload] response missing media id:', JSON.stringify(result));
      return NextResponse.json(
        { error: 'Kapso upload response missing media id', detail: result },
        { status: 502 },
      );
    }

    return NextResponse.json({ mediaId, url: null });
  } catch (error) {
    console.error('[media/upload] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload' },
      { status: 500 },
    );
  }
}
