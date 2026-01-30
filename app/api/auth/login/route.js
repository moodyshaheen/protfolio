import { NextResponse } from 'next/server';

import { getSessionCookieName, signSessionToken } from '../../../../lib/server/auth.js';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials are not configured (ADMIN_EMAIL/ADMIN_PASSWORD).' },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = signSessionToken({
      typ: 'admin',
      email,
      iat: now,
      exp: now + 60 * 60 * 24 * 30, // 30 days
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Login failed' }, { status: 500 });
  }
}

