'use server';

import { getSession } from '@lib/session/session';

import { UpdateUserRole } from './components/UpdateUserRole';
import { UpdateUserPassword } from './components/UpdateUserPassword';
import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/types/types';
import { RolesEnum } from '@repo/shared/enums';

export default async function Router() {
  const session = await getSession();

  if (!session?.user.role) {
    return <UpdateUserRole />;
  }

  if (session?.user.tempPassword) {
    return <UpdateUserPassword />;
  }

  if (session.user.privateWorkerId && !session.user.tempPassword) {
    redirect(
      APP_ROUTES.PRIVATE_WORKERS.DASHBOARD(session.user.privateWorkerId),
    );
  }
  if (session.user.role === RolesEnum.salon) {
    redirect(APP_ROUTES.ADMIN.DASHBOARD);
  }
  if (session.user.role === RolesEnum.customer) {
    redirect(APP_ROUTES.CUSTOMER.DASHBOARD);
  }
}
