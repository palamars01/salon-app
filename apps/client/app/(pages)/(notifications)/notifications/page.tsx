import { ListHeader } from '@/components/ListHeader/ListHeader';
import { PageNav } from '@/components/PageNav/PageNav';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';
import { getAll } from '@/lib/actions/notifications';
import { checkRolePermission } from '@/lib/utils/utils';
import { Box } from '@mui/material';
import { RolesEnum } from '@repo/shared/enums';

import { NotificationItem } from '../components/NotificationItem/NotificationItem';

import styles from './notifications.module.scss';

export default async function NotificationsList() {
  await checkRolePermission([
    RolesEnum.customer,
    RolesEnum.salon,
    RolesEnum.privateWorker,
  ]);

  const { data } = await getAll();

  return (
    <Box>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <PageNav title="Notifications" nav={true} showNotificationsIcon={false} />
      <Box className={styles.container}>
        <ListHeader
          title=""
          button={{ href: '#', title: 'Mark all as read' }}
        />

        <Box className={styles.list}>
          {data.notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
