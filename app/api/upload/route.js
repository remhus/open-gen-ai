import { NextResponse } from 'next/server';

const MUAPI_UPLOAD_URL = 'https://api.muapi.ai/api/v1/upload_file';

function getApiKey(request) {
    // Cookie is the most reliable — automatically sent with same-origin XHR
    // and not stripped by Netlify/AWS infra (unlike x-api-key header)
    const cookieKey = request.cookies.get('muapi_key')?.value;
    if (cookieKey) return cookieKey;
    return request.headers.get('x-api-key');
}

export async function POST(request) {
    const apiKey = getApiKey(request);
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
    }

    try {
        const incoming = await request.formData();
        const outgoing = new FormData();
        for (const [key, value] of incoming.entries()) {
            outgoing.append(key, value);
        }

        const response = await fetch(MUAPI_UPLOAD_URL, {
            method: 'POST',
            headers: { 'x-api-key': apiKey },
            body: outgoing,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
