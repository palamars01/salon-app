import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session/session';
import { APP_ROUTES } from '@/lib/types/types';

export async function middleware(req: NextRequest) {
  const payload = await getSession();

  if (!payload) {
    // User is not auth
    if (req.nextUrl.pathname.match(/salon|customer|dashboard/)) {
      return NextResponse.redirect(new URL(APP_ROUTES.AUTH.MAIN, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /auth and api and the static folder
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
