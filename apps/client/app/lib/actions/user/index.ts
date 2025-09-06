'use server';
import { PublicUser, User } from '@repo/shared/interfaces/user';
import { ApiRoutes } from '@repo/shared/enums';

import { handleResponseWithSessionUpdate, withFetch } from '@lib/utils/utils';

export const updateUser = async (formData: FormData | Partial<User>) => {
  const userData: Partial<User> =
    formData instanceof FormData ? Object.fromEntries(formData) : formData;

  const { data, errors } = await withFetch<
    typeof userData,
    { user: PublicUser }
  >({
    api: ApiRoutes.users.update,
    authType: 'Bearer',
    body: userData,
  });

  return handleResponseWithSessionUpdate(data, errors);
};
