import { Box, Typography } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { UpcomingRequest } from '@/components/UpcomingRequest/Request/UpcomingRequest';
import { QueueCard } from '@/components/QueueCard/QueueCard';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';
import { DashboardAppointment } from '@repo/shared/interfaces/appointment';

import { getAppointmentsByStatus } from '@/lib/actions/appointment';
import { APP_ROUTES } from '@/lib/types/types';

import { checkRolePermission } from '@/lib/utils/utils';

import styles from './customersQueue.module.scss';

export async function generateMetadata() {
  return {
    title: 'Customers in Queue',
  };
}

interface Props {
  params: Promise<{
    filters: [AppointmentStatusEnum, string]; // /appointmentStatus/salonId?/
  }>;
}

export default async function AppointmentQueuPage({ params }: Props) {
  await checkRolePermission([RolesEnum.salon, RolesEnum.privateWorker]);
  const { filters } = await params;

  const [appointmentStatus, salonId] = filters;

  const title =
    appointmentStatus === AppointmentStatusEnum.pending
      ? 'Upcoming Requests'
      : 'Customers in Queue';
  const { data } = await getAppointmentsByStatus(...filters);

  const pathToRevalidate = APP_ROUTES.APPOINTMENTS.QUEUE(
    salonId ? `${appointmentStatus}/${salonId}` : appointmentStatus,
  );

  const CurrentCard = (a: DashboardAppointment) =>
    appointmentStatus === AppointmentStatusEnum.approved ? (
      <QueueCard
        key={a.id}
        bgColor="#D3E2D1"
        cssClass={styles.card}
        declineColor="#325928"
        acceptColor={{ text: '#F8F2EC', bg: '#325928' }}
        appointment={a}
        pathToRevalidate={pathToRevalidate}
        displayOn="list"
      />
    ) : (
      <UpcomingRequest
        key={a.id}
        bgColor="#D3E2D1"
        declineColor="#325928"
        acceptColor={{ bg: '#325928', text: '#D3E2D1' }}
        upcomingRequest={a}
        pathToRevalidate={pathToRevalidate}
      />
    );

  return (
    <Box>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <PageNav title={title} nav={true} notificationsPath={pathToRevalidate} />
      <Box className={styles.container}>
        {data.appointments?.salonName && (
          <Typography className={styles.salonName}>
            {data.appointments?.salonName}
          </Typography>
        )}
        <Box
          className={styles.requests}
          sx={{ gap: data?.groupedAppointments?.length ? '26px' : '17px' }}
        >
          {data?.appointments?.list.length
            ? data.appointments.list.map((a) => CurrentCard(a))
            : data?.groupedAppointments?.map((a) => {
                if (!a) return null;
                return (
                  <Box key={a.appointment.id} sx={{ width: '100%' }}>
                    <ListHeader
                      title={a.salon.name}
                      button={{
                        title: 'View All',
                        href: APP_ROUTES.APPOINTMENTS.QUEUE(
                          `${appointmentStatus}/${a.salon.id}`,
                        ),
                      }}
                    />
                    {CurrentCard(a.appointment)}
                  </Box>
                );
              })}
        </Box>
      </Box>
    </Box>
  );
}
