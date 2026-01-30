const COOKIE_NAME = 'admin_session';

export function getSessionCookieName() {
  return COOKIE_NAME;
}

function base64UrlToBase64(str) {
  return String(str).replace(/-/g, '+').replace(/_/g, '/');
}

function base64ToBase64Url(str) {
  return String(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64UrlToString(b64url) {
  const b64 = base64UrlToBase64(b64url);
  // pad
  const padLen = (4 - (b64.length % 4)) % 4;
  const padded = b64 + '='.repeat(padLen);
  return atob(padded);
}

function encodeBytesToBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return base64ToBase64Url(btoa(bin));
}

async function hmacSha256Base64Url(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return encodeBytesToBase64Url(new Uint8Array(sig));
}

export async function verifySessionTokenEdge(token) {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const parts = String(token || '').split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const data = `${h}.${p}`;

    const expected = await hmacSha256Base64Url(data, secret);
    if (s !== expected) return null;

    const payloadStr = decodeBase64UrlToString(p);
    const payload = JSON.parse(payloadStr);
    if (!payload || payload.typ !== 'admin') return null;

    if (payload.exp && Date.now() > payload.exp * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

