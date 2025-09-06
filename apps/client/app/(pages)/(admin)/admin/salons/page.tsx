'use server';
import { redirect } from 'next/navigation';
import { Box } from '@mui/material';

import { SalonsList } from '@/components/SalonsList/SalonsList';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { UpcomingRequest } from '@/components/UpcomingRequest/Request/UpcomingRequest';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { PageNav } from '@/components/PageNav/PageNav';

import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';

import { getSalonsByAdminId } from '@/lib/actions/salon';
import { getSession } from '@/lib/session/session';
import { APP_ROUTES } from '@/lib/types/types';

import styles from './salons-list.module.scss';

export async function generateMetadata() {
  return {
    title: 'Salons List',
  };
}

export default async function SalonListPage() {
  const session = await getSession();

  if (session?.user.role !== RolesEnum.salon) {
    redirect(APP_ROUTES.ROUTER);
  }
  const { data } = await getSalonsByAdminId();

  return (
    <Box>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <PageNav title="Salons" nav={true} />
      <Box className={styles.container}>
        {data.firstUpcomingAppointment && (
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
              bgColor="#D3E2D1"
              declineColor="#325928"
              acceptColor={{ bg: '#325928', text: '#D3E2D1' }}
              upcomingRequest={data?.firstUpcomingAppointment}
              pathToRevalidate={APP_ROUTES.ADMIN.SALONS}
            />
          </Box>
        )}
        <SalonsList salons={data.salons} />
      </Box>
    </Box>
  );
}
