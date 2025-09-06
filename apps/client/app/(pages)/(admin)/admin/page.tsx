'use server';

import { APP_ROUTES } from '@/lib/types/types';
import { getSession } from '@lib/session/session';
import { RolesEnum } from '@repo/shared/enums';
import { redirect } from 'next/navigation';
export default async function Page() {
  const session = await getSession();

  if (session?.user.role !== RolesEnum.salon) {
    redirect(APP_ROUTES.ROUTER);
  }
}
