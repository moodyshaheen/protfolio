import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlJson(obj) {
  return base64url(JSON.stringify(obj));
}

function signHmacSha256(data, secret) {
  return base64url(crypto.createHmac('sha256', secret).update(data).digest());
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function signSessionToken(payload) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not defined');

  const header = { alg: 'HS256', typ: 'JWT' };
  const data = `${base64urlJson(header)}.${base64urlJson(payload)}`;
  const sig = signHmacSha256(data, secret);
  return `${data}.${sig}`;
}

export function verifySessionToken(token) {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const parts = String(token || '').split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const data = `${h}.${p}`;
    const expected = signHmacSha256(data, secret);
    // constant-time compare
    const a = Buffer.from(s);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    if (!payload || payload.typ !== 'admin') return null;

    // expiry (seconds)
    if (payload.exp && Date.now() > payload.exp * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

export function parseCookie(headerValue) {
  const out = {};
  const raw = headerValue || '';
  raw.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

export function readSessionFromRequest(req) {
  const cookies = parseCookie(req.headers.get('cookie'));
  const token = cookies[COOKIE_NAME];
  return token ? verifySessionToken(token) : null;
}

export function requireAdmin(req) {
  const session = readSessionFromRequest(req);
  return session;
}

