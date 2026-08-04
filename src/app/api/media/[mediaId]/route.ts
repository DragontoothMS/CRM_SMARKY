import { NextResponse } from 'next/server';
import { configurationErrorResponse, resolvePhoneNumberContext } from '@/lib/inbox-settings';
import { whatsappClient } from '@/lib/whatsapp-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const configuredPhoneNumber = await resolvePhoneNumberContext(searchParams.get('phoneNumberId') ?? undefined);
    const phoneNumberId = configuredPhoneNumber.phone_number_id;

    const [metadata, buffer] = await Promise.all([
      whatsappClient.media.get({
        mediaId,
        phoneNumberId
      }),
      whatsappClient.media.download({
        mediaId,
        phoneNumberId,
        auth: 'never'
      })
    ]);

    if (buffer instanceof Response) {
      return buffer;
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': metadata.mimeType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return configurationErrorResponse(error);
  }
}
