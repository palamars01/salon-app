import { Box } from '@mui/material';

import { checkRolePermission } from '@/lib/utils/utils';

import { RolesEnum } from '@repo/shared/enums';

import { PageNav } from '@/components/PageNav/PageNav';

export default async function NotificationsList() {
  await checkRolePermission([RolesEnum.admin]);
  return (
    <Box>
      <PageNav title="Notifications" nav={true} />
    </Box>
  );
}
