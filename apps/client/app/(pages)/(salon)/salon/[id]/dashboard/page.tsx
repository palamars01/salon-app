import Link from 'next/link';

import { Box, Typography } from '@mui/material';

import { MainButton } from '@/components/Button/Button';

import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';

import { APP_ROUTES } from '@/lib/types/types';
import { getSalonDashboard } from '@/lib/actions/salon';
import { checkRolePermission } from '@/lib/utils/utils';

import { QueueCard } from '@/components/QueueCard/QueueCard';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { HeaderActions } from '@/components/HeaderActions/HeaderActions';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { WidgetList } from './components/SalonWidgetList/SalonWidgetList';
import { CheckInButton } from './components/CheckInButton/CheckInButton';

import styles from './salonDashboard.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SalonDashboard({ params }: Props) {
  const { role } = await checkRolePermission([RolesEnum.salon]);
  const { id } = await params;

  const { data } = await getSalonDashboard(id);

  const { salon, firstApprovedAppointment } = data;

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}
      <Box className={styles.description}>
        <Typography className={styles.title}>{salon.name} Dashboard</Typography>
        <Typography className={styles.text}>
          Relax, you’re all caught up! <span>✌️</span>
        </Typography>
        <Typography className={styles.subText}>
          Take a breather, grab some coffee☕, and get ready for the next rush!
        </Typography>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        {role === RolesEnum.salon && (
          <MainButton
            title="Admin Dashboard"
            buttonProps={{
              component: Link,
              href: APP_ROUTES.ADMIN.DASHBOARD,
              sx: { width: 'fit-content', textTransform: 'none' },
              variant: 'contained',
            }}
            cssClassName={styles.backButton}
          />
        )}
        <HeaderActions
          notificationsPath={APP_ROUTES.SALON.NOTIFICATIONS.LIST(id)}
        />
      </Box>
      <WidgetList salon={salon} />
      {firstApprovedAppointment && (
        <Box className={styles.queue}>
          <ListHeader
            title="Customers In Queue"
            button={{
              title: 'View All',
              href: APP_ROUTES.APPOINTMENTS.QUEUE(
                AppointmentStatusEnum.approved + `/${id}`,
              ),
            }}
          />
          <QueueCard
            appointment={firstApprovedAppointment}
            pathToRevalidate={APP_ROUTES.SALON.DASHBOARD(id)}
          />
        </Box>
      )}

      <Box className={styles.actions}>
        <MainButton
          title="Settings"
          buttonProps={{
            component: Link,
            href: APP_ROUTES.SALON.SETTINGS.MAIN(id!),
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
        <CheckInButton id={id!} />
      </Box>
    </Box>
  );
}
