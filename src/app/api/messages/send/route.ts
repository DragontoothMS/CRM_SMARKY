import { NextResponse } from 'next/server';

const KAPSO_API_BASE = 'https://api.kapso.ai';
const KAPSO_API_KEY = process.env.KAPSO_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { phoneNumberId: rawPhoneNumberId, to, body, type = 'text', mediaId } = await request.json();

    if (!to || !body) {
      return NextResponse.json({ error: 'Missing required fields: to, body' }, { status: 400 });
    }

    if (!KAPSO_API_KEY) {
      return NextResponse.json({ error: 'KAPSO_API_KEY not configured' }, { status: 500 });
    }

    const phoneNumberId = rawPhoneNumberId || process.env.PHONE_NUMBER_ID || '';
    if (!phoneNumberId) {
      return NextResponse.json({ error: 'No phone number configured' }, { status: 500 });
    }

    const apiUrl = `${KAPSO_API_BASE}/meta/whatsapp/v24.0/${phoneNumberId}/messages`;

    const payload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type,
    };

    if (type === 'text') {
      payload.text = { body, preview_url: false };
    } else if (type === 'template') {
      payload.template = body;
    } else if (['image', 'video', 'audio', 'document'].includes(type) && mediaId) {
      payload[type] = { id: mediaId, caption: body };
    } else {
      payload.text = { body, preview_url: false };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KAPSO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 },
    );
  }
}