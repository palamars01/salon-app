'use server';

import { checkRolePermission } from '@/lib/utils/utils';
import { NotificationsSettings } from './Settings/Settings';
import { RolesEnum } from '@repo/shared/enums';
import { Box } from '@mui/material';
import { PageNav } from '@/components/PageNav/PageNav';

export default async function NotificationsSettingsPage() {
  const { notificationsSettings } = await checkRolePermission([
    RolesEnum.customer,
  ]);

  return (
    <Box>
      <PageNav title="Notifications Settings" nav={true} />
      <NotificationsSettings {...notificationsSettings!} />;
    </Box>
  );
}
