'use server';

import { checkRolePermission } from '@/lib/utils/utils';
import { NotificationsSettings } from './Settings/Settings';
import { RolesEnum } from '@repo/shared/enums';
import { Box } from '@mui/material';
import { PageNav } from '@/components/PageNav/PageNav';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NotificationsSettingsPage({ params }: Props) {
  const { notificationsSettings } = await checkRolePermission([
    RolesEnum.salon,
  ]);
  const { id } = await params;
  return (
    <Box>
      <PageNav title="Notifications Settings" nav={true} />
      <NotificationsSettings {...notificationsSettings!} id={id} />;
    </Box>
  );
}
