'use server';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Box, IconButton, Typography } from '@mui/material';

import { getStatusData } from '@/lib/actions/appointment';
import { checkRolePermission } from '@/lib/utils/utils';
import { APP_ROUTES } from '@/lib/types/types';

import { RolesEnum } from '@repo/shared/enums';

import { HomeIcon } from '@/components/Icons/HomeIcon';
import { NotificationsIcon } from '@/components/HeaderActions/NotificationsIcon';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { Actions } from './components/Actions/Actions';
import { Timer } from './components/Timer/Timer';

import styles from './appointmentStatus.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AppointmentStatus({ params }: Props) {
  await checkRolePermission([RolesEnum.customer]);

  const { id } = await params;
  const { data, errors } = await getStatusData(id);

  if (errors) {
    redirect(APP_ROUTES.CUSTOMER.DASHBOARD);
  }

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <Box className={styles.content}>
        <Typography className={styles.title}>Queue Status</Typography>
        <Typography className={styles.name}>
          {data.appointment.salonName}
        </Typography>
        <Timer arrivalTime={data.appointment.arrivalTime} />
        <Box className={styles.icons}>
          <IconButton LinkComponent={Link} href={APP_ROUTES.CUSTOMER.DASHBOARD}>
            <HomeIcon />
          </IconButton>
          <NotificationsIcon
            color="#fff"
            notificationsPath={APP_ROUTES.NOTIFICATIONS.LIST}
          />
        </Box>
      </Box>
      <Box className={styles.appointment}>
        <Box className={styles.entryTime}>
          <Typography className={styles.title}>Queue Entry Time</Typography>
          <Typography className={styles.time}>
            {data.appointment.joinTime}
          </Typography>
        </Box>
        <Box className={styles.waitTime}>
          <Typography className={styles.title}>Estimated Wait Time</Typography>
          <Typography className={styles.time}>
            {data.appointment.waitTimeInMinutes} mins
          </Typography>
        </Box>
        <Actions appointmentId={id} />
      </Box>
    </Box>
  );
}
