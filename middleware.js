import { NextResponse } from 'next/server';

import { getSessionCookieName, verifySessionTokenEdge } from './lib/server/auth.edge.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(getSessionCookieName())?.value;
    const session = token ? await verifySessionTokenEdge(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

