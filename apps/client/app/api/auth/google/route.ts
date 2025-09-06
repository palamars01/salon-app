import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { createSession } from '@/lib/session/session';
import { APP_ROUTES, Session } from '@/lib/types/types';
import { JwtPayload, JwtTokens } from '@repo/shared/interfaces/jwt';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userData = searchParams.get('u');
  const jwtData = searchParams.get('j');

  const user = Object.fromEntries(
    JSON.parse(userData!),
  ) as unknown as JwtPayload;
  const jwtTokens = Object.fromEntries(
    JSON.parse(jwtData!),
  ) as unknown as JwtTokens;

  if (!jwtTokens.accessToken || !jwtTokens.refreshToken || !user.id) {
    console.log('Google Auth failed');
    redirect(APP_ROUTES.AUTH.MAIN);
  }

  const payload: Session = { user, jwtTokens };

  await createSession(payload);

  redirect(APP_ROUTES.ROUTER);
}
