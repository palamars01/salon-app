'use server';
import Link from 'next/link';
import { Box } from '@mui/material';

import { UpcomingRequest } from '@/components/UpcomingRequest/Request/UpcomingRequest';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { MainButton } from '@/components/Button/Button';
import { HeaderActions } from '@/components/HeaderActions/HeaderActions';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';

import { APP_ROUTES } from '@/lib/types/types';
import { getAdminDashboard } from '@/lib/actions/salon';
import { checkRolePermission } from '@/lib/utils/utils';

import { AdminWidgetsList } from './components/AdminWidgetsList/AdminWidgetsList';

import styles from './adminDashboard.module.scss';

export default async function AdminDashboardPage() {
  await checkRolePermission([RolesEnum.salon]);

  const { data } = await getAdminDashboard();

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}
      <Box sx={{ mt: 1 }}>
        <HeaderActions
          notificationsPath={APP_ROUTES.ADMIN.NOTIFICATIONS.LIST}
        />
      </Box>
      <AdminWidgetsList widgetsData={data.widgetsData} />
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
          title="Add New Salon"
          buttonProps={{ component: Link, href: APP_ROUTES.SALON.CREATE }}
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
        <MainButton
          title="View Salons"
          buttonProps={{
            component: Link,
            href: APP_ROUTES.ADMIN.SALONS,
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
      </Box>
    </Box>
  );
}
