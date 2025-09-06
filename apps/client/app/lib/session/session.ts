'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SignJWT, jwtVerify } from 'jose';

import { APP_ROUTES, Session } from '@lib/types/types';
import { JwtTokens, JwtPayload } from '@repo/shared/interfaces/jwt';

import { config } from '@/config/config';

const secretKey = config.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify<Session>(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    console.log('Failed to verify session');
  }
}

export async function createSession(payload: Session) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt(payload);
    const cookieStore = await cookies();
    const headersList = await headers();

    const origin = headersList.get('origin');

    cookieStore.set('session', session, {
      httpOnly: true,
      secure: origin?.includes('https'),
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
  } catch (e) {
    console.log('err create session: ', e);
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;

    if (!cookie) return null;
    const payload = await decrypt(cookie);

    return payload as Session;
  } catch {
    redirect(APP_ROUTES.AUTH.SIGNIN);
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete('session');
}

export const updateSession = async (
  jwtTokens?: JwtTokens,
  user?: JwtPayload,
) => {
  const session = await getSession();

  if (!session) return null;

  const payload: Session = session;

  if (jwtTokens) {
    payload.jwtTokens = jwtTokens;
  } else if (user) {
    payload.user = user;
  }

  if (session?.user) await createSession(payload);

  return 'OK';
};
