// /app/api/route-name/route.ts
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const receivedHmac = req.headers.get('Signature');

    // Validate the HMAC
    if (!validateHmac(body, receivedHmac, process.env.SECRET_KEY)) {
      return new Response('Invalid HMAC', { status: 401 });
    }

    return new Response(
      JSON.stringify({
        // (Add object here...)
      }),
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function validateHmac(body: string, receivedHmac: string | null, secretKey: string): boolean {
  if (!receivedHmac) {
    return false;
  }

  const calculatedHmac = createHmac('sha256', secretKey).update(JSON.stringify(body)).digest('hex');

  return receivedHmac === calculatedHmac;
}
