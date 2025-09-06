import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { UpcomingRequest } from '@/components/UpcomingRequest/Request/UpcomingRequest';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { HeaderActions } from '@/components/HeaderActions/HeaderActions';
import { MainButton } from '@/components/Button/Button';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';

import { APP_ROUTES } from '@/lib/types/types';
import { checkRolePermission } from '@/lib/utils/utils';
import { getPrivateWorkerDasdboard } from '@/lib/actions/privateWorkers';

import { QueueCard } from '@/components/QueueCard/QueueCard';
import { AdminWidgetsList } from './components/AdminWidgetsList/AdminWidgetsList';

import styles from './privateWorkerDashboard.module.scss';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrivateWorkerDashboardPage({ params }: Props) {
  await checkRolePermission([RolesEnum.privateWorker]);
  const { id } = await params;

  const { data } = await getPrivateWorkerDasdboard(id);

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <Box sx={{ mt: 1 }}>
        <HeaderActions
          notificationsPath={APP_ROUTES.SALON.NOTIFICATIONS.LIST(data.salon.id)}
        />
      </Box>
      <Typography className={styles.title}>
        {data.salon.name} Dashboard
      </Typography>
      <Typography sx={{ color: '#fff' }}>(private stylist)</Typography>
      <AdminWidgetsList widgetsData={data.widgetsData} salon={data.salon} />

      {data.firstApprovedAppointment?.id && (
        <Box className={styles.requests}>
          <ListHeader
            title="Customers in Queue"
            button={{
              title: 'View All',
              href: APP_ROUTES.APPOINTMENTS.QUEUE(
                AppointmentStatusEnum.approved,
              ),
            }}
          />
          <QueueCard
            appointment={data.firstApprovedAppointment}
            pathToRevalidate={APP_ROUTES.ADMIN.DASHBOARD}
          />
        </Box>
      )}
      {data.firstUpcomingAppointment?.id && (
        <Box className={styles.requests}>
          <ListHeader
            title="Upcoming Request"
            button={{
              title: 'View All',
              href: APP_ROUTES.APPOINTMENTS.QUEUE(
                AppointmentStatusEnum.pending,
              ),
            }}
          />
          <UpcomingRequest
            upcomingRequest={data.firstUpcomingAppointment}
            pathToRevalidate={APP_ROUTES.ADMIN.DASHBOARD}
          />
        </Box>
      )}

      <Box className={styles.actions}>
        <MainButton
          title="Settings"
          buttonProps={{
            component: Link,
            href: '#',
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
          title="View Active Queues"
          buttonProps={{
            variant: 'contained',
            component: Link,
            href: APP_ROUTES.APPOINTMENTS.QUEUE(AppointmentStatusEnum.approved),
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
