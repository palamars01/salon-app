import { redirect } from 'next/navigation';

import { RolesEnum } from '@repo/shared/enums';
import { PublicUser } from '@repo/shared/interfaces/user';
import { JwtPayload, JwtTokens } from '@repo/shared/interfaces/jwt';

import { APP_ROUTES, Response } from '@lib/types/types';
import { config } from '@/config/config';

import {
  createSession,
  deleteSession,
  getSession,
  updateSession,
} from '../session/session';
import { getRefreshedTokens } from '../actions/auth';

interface Fetch<T> {
  api: { route: string; method: string };
  body?: T;
  authType?: 'Bearer' | 'Refresh';
  isClient?: boolean;
}

export const withFetch = async <Body, ApiResponse>(
  parameters: Fetch<Body>,
): Promise<Response<ApiResponse & { jwtTokens?: JwtTokens }>> => {
  const session = await getSession();

  const headers = {
    'Content-Type': 'application/json',
    authorization: '',
    cookie: '',
  };

  const { api, authType, body } = parameters;

  if (authType) {
    const jwtTokenKey = authType === 'Bearer' ? 'accessToken' : 'refreshToken';
    headers.authorization = `${authType} ${session?.jwtTokens[jwtTokenKey]}`;
  }

  const fetchOptions: RequestInit = {
    method: api.method,
    headers,
    cache: 'no-store',
  };
  if (body) fetchOptions.body = JSON.stringify(body);

  let response = await fetch(`${config.BACKEND_URL}${api.route}`, fetchOptions);
  let jwtTokens: JwtTokens | undefined = undefined;

  if (response.status === 401) {
    jwtTokens = await getRefreshedTokens();

    if (jwtTokens?.accessToken) {
      headers.authorization = `Bearer ${jwtTokens.accessToken}`;
      response = await fetch(`${config.BACKEND_URL}${api.route}`, fetchOptions);
      if (parameters.isClient) {
        await updateSessionWithTokens(jwtTokens);
      }
    } else {
      await deleteSession();
      redirect(APP_ROUTES.AUTH.SIGNIN);
    }
  }
  const data: Response<ApiResponse & { jwtTokens?: JwtTokens }> =
    await response.json();

  if (jwtTokens && !data.data.jwtTokens && !parameters.isClient) {
    data.data.jwtTokens = jwtTokens;
  }

  return data;
};

export const updateSessionWithTokens = async (jwtTokens: JwtTokens) => {
  if (jwtTokens?.accessToken) {
    const result = await updateSession(jwtTokens);

    if (result === 'OK') {
      return result;
    }
  }
  return null;
};

export const checkRolePermission = async (roles: RolesEnum[]) => {
  const session = await getSession();

  if (session && !roles.includes(session.user.role!)) {
    redirect(APP_ROUTES.ROUTER);
  }

  return {
    role: session?.user.role,
    userId: session?.user.id,
    privateWorkerId: session?.user.privateWorkerId,
    fName: session?.user.fName || '',
    phone: session?.user.phone || '',
    notificationsSettings: session?.user.notificationsSettings,
  };
};

export const handleResponseWithSessionUpdate = async (
  data: { user: PublicUser; jwtTokens?: JwtTokens },
  errors: string[] | undefined,
) => {
  const session = await getSession();
  let payload: JwtPayload | null = null;
  let jwtTokens: JwtTokens | undefined = session?.jwtTokens;

  if (data?.user) {
    const { user } = data;
    payload = {
      id: user.id,
      role: user.role,
      tempPassword: user.tempPassword,
      privateWorkerId: user.privateWorkerId,
      fName: user.fName,
      lName: user.lName,
      phone: user.phone,
      notificationsSettings: user.notificationsSettings,
    };
  }

  if (!jwtTokens) {
    jwtTokens = data?.jwtTokens;
  }
  if (session) {
    jwtTokens = session.jwtTokens;
  }

  if (payload && jwtTokens) {
    await createSession({ user: payload, jwtTokens });
  }

  return { data, errors };
};
