'use client';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';

import { SalonIcon } from '@/components/Icons/SalonIcon';
import { CardButtons } from '@/components/CardButtons/CardButtons';

import { updateAppointment } from '@/lib/actions/appointment';

import {
  Appointment,
  DashboardAppointment,
} from '@repo/shared/interfaces/appointment';
import { AppointmentStatusEnum } from '@repo/shared/enums';

import styles from './upcomingRequest.module.scss';

interface Props {
  bgColor?: string;
  declineColor?: string;
  acceptColor?: {
    text: string;
    bg: string;
  };
  upcomingRequest: DashboardAppointment;
  pathToRevalidate: string;
}

export function UpcomingRequest({
  bgColor = '#4B9443',
  declineColor = '#ffffff',
  acceptColor = { text: '#4B9443', bg: '#ffffff' },
  upcomingRequest,
  pathToRevalidate,
}: Props) {
  const handleUpdateAppointment = async (body: Partial<Appointment>) => {
    const { data } = await updateAppointment(
      body,
      upcomingRequest.id,
      pathToRevalidate,
    );
    if (data) {
      toast.success('Appointment was updated successfully');
    }
  };
  return (
    <Box className={styles.container} sx={{ backgroundColor: bgColor }}>
      <Box className={styles.header}>
        <Box className={styles.info}>
          <Typography className={styles.customerName}>
            {upcomingRequest.customer.fName || 'N/A'}
          </Typography>
          <Typography className={styles.customerPhone}>
            {upcomingRequest.customer.phone || 'N/A'}
          </Typography>
        </Box>

        <Box className={styles.info}>
          <Box className={styles.icon} sx={{ color: declineColor }}>
            <SalonIcon color={declineColor} />
          </Box>
          <Typography className={styles.salonName}>
            {upcomingRequest.salon.name}
          </Typography>
        </Box>
      </Box>
      <Typography className={styles.address}>
        {upcomingRequest.salon.address}
      </Typography>
      <CardButtons
        lButton={{
          title: 'Decline',
          color: declineColor,
          props: {
            onClick: async () => {
              await handleUpdateAppointment({
                status: AppointmentStatusEnum.declined,
              });
            },
          },
        }}
        rButton={{
          bgColor: acceptColor.bg,
          title: 'Accept',
          textColor: acceptColor.text,
          props: {
            onClick: async () => {
              await handleUpdateAppointment({
                status: AppointmentStatusEnum.approved,
              });
            },
          },
        }}
      />
    </Box>
  );
}
