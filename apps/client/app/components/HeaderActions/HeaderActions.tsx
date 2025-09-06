'use server';
import { Box } from '@mui/material';

import { checkRolePermission } from '@/lib/utils/utils';
import { APP_ROUTES } from '@/lib/types/types';

import { RolesEnum } from '@repo/shared/enums';

import { NotificationsIcon } from './NotificationsIcon';
import { Logout } from '../Logout/Logout';

import styles from './headerActions.module.scss';

interface Props {
  notificationsPath?: string;
  showNotificationsIcon?: boolean;
}

export async function HeaderActions({ showNotificationsIcon = true }: Props) {
  const { userId } = await checkRolePermission([
    RolesEnum.customer,
    RolesEnum.salon,
    RolesEnum.privateWorker,
  ]);
  if (!userId) return null;

  return (
    <Box className={styles.container}>
      {showNotificationsIcon && (
        <NotificationsIcon notificationsPath={APP_ROUTES.NOTIFICATIONS.LIST} />
      )}
      <Logout />
    </Box>
  );
}
