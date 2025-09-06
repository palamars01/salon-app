'use server';

import { checkRolePermission } from '@/lib/utils/utils';
import { NotificationsSettings } from './Settings/Settings';
import { RolesEnum } from '@repo/shared/enums';

export default async function NotificationsSettingsPage() {
  const { notificationsSettings } = await checkRolePermission([
    RolesEnum.admin,
  ]);

  return <NotificationsSettings {...notificationsSettings!} />;
}
