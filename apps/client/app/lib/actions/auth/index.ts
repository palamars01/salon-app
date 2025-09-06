'use server';

import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@lib/types/types';
import { deleteSession, getSession } from '@lib/session/session';
import { handleResponseWithSessionUpdate, withFetch } from '@lib/utils/utils';

import { ApiRoutes, AuthProvidersEnum } from '@repo/shared/enums';
import { Signup, Signin, SignupRole } from '@repo/shared/interfaces/auth';
import { JwtTokens } from '@repo/shared/interfaces/jwt';
import { PublicUser } from '@repo/shared/interfaces/user';

import { config } from '@/config/config';

export const signup = async (formData: FormData) => {
  const signupData: Signup = {
    authProvider: formData.get('authProvider') as AuthProvidersEnum,
    role: formData.get('role') as SignupRole,
    password: formData.get('password')!.toString(),
    authValue: formData.get('authValue')!.toString(),
  };

  const confrimPassword = formData.get('confirmPassword');

  if (signupData.password !== confrimPassword) {
    return { errors: ['Passwords must be equal'], data: null };
  }

  if (signupData.authProvider === AuthProvidersEnum.PHONE) {
    const dialCode = formData.get('dialCode')!.toString()!;
    signupData.authValue = dialCode + signupData.authValue;
  }

  const { data, errors } = await withFetch<
    Signup,
    { user: PublicUser; jwtTokens: JwtTokens }
  >({
    api: ApiRoutes.auth.signup,
    body: signupData,
  });
  return await handleResponseWithSessionUpdate(data, errors);
};

export const signin = async (formData: FormData) => {
  const authProvider = formData.get('authProvider');

  const signinData: Signin = {
    password: formData.get('password')!.toString(),
    authValue: formData.get('authValue')!.toString(),
  };

  if (authProvider === AuthProvidersEnum.PHONE) {
    const dialCode = formData.get('dialCode')!.toString()!;
    signinData.authValue = dialCode + signinData.authValue;
  }

  try {
    const { data, errors } = await withFetch<
      Signin,
      { user: PublicUser; jwtTokens: JwtTokens }
    >({
      api: ApiRoutes.auth.signin,
      body: signinData,
    });

    return await handleResponseWithSessionUpdate(data, errors);
  } catch {
    return {
      data: null,
      errors: ['Something went wrong. Try again'],
    };
  }
};

export const getRefreshedTokens = async (): Promise<JwtTokens | undefined> => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${config.BACKEND_URL}${ApiRoutes.auth.refreshToken.route}`,
      {
        method: ApiRoutes.auth.refreshToken.method,
        headers: {
          authorization: `Refresh ${session?.jwtTokens.refreshToken}`,
        },
      },
    );

    const { data, errors }: { data: JwtTokens; errors: string[] } =
      await response.json();

    if (errors?.includes('logout')) {
      return undefined;
    }

    return data;
  } catch {}
};

export const logout = async () => {
  await deleteSession();
  return redirect(APP_ROUTES.AUTH.MAIN);
};
