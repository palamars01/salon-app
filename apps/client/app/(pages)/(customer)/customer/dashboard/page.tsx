import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { getSession } from '@/lib/session/session';
import { APP_ROUTES } from '@/lib/types/types';

import { MainButton } from '@/components/Button/Button';
import { HeaderActions } from '@/components/HeaderActions/HeaderActions';

import styles from './dasboard.module.scss';

export default async function CustomerPage() {
  const session = await getSession();

  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Typography>
          Welcome {session?.user.fName} <span>👋</span>
        </Typography>
        <Typography>
          Tap the “Join Queue” button below to secure your spot.
        </Typography>
      </Box>

      {/* Notifications and logout*/}
      <HeaderActions
        notificationsPath={APP_ROUTES.CUSTOMER.NOTIFICATIONS.LIST}
      />

      <Box className={styles.actions}>
        <MainButton
          title="View Salons"
          buttonProps={{
            component: Link,
            href: APP_ROUTES.CUSTOMER.SALONS,
            variant: 'outlined',
            sx: {
              border: '1px solid white',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ffffff1A',
              },
            },
          }}
        />
        <MainButton
          title="Notifications Settings"
          buttonProps={{
            variant: 'contained',
            component: Link,
            href: APP_ROUTES.CUSTOMER.NOTIFICATIONS.SETTINGS,
            sx: {
              backgroundColor: '#ffffff',
              color: '#4B9443',
              '&:hover': {
                backgroundColor: '#4B9443',
                color: '#ffffff',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
