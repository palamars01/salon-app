'use server';

import { checkRolePermission } from '@/lib/utils/utils';
import { Settings } from './Settings/Settings';
import { RolesEnum } from '@repo/shared/enums';
import { Box } from '@mui/material';
import { PageNav } from '@/components/PageNav/PageNav';
import { getSalonDashboard } from '@/lib/actions/salon';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NotificationsSettingsPage({ params }: Props) {
  await checkRolePermission([RolesEnum.salon]);
  const { id } = await params;
  const { data } = await getSalonDashboard(id);

  return (
    <Box>
      <PageNav
        title="
       Settings"
        nav={true}
      />
      <Settings {...data.salon.notificationsSettings!} id={id} />;
    </Box>
  );
}
