'use client';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { CardButtons } from '@/components/CardButtons/CardButtons';

import { WaitTimeIcon } from '@/components/Icons/WaitTimeIcon';

import {
  Appointment,
  DashboardAppointment,
} from '@repo/shared/interfaces/appointment';
import { AppointmentStatusEnum } from '@repo/shared/enums';

import { updateAppointment } from '@/lib/actions/appointment';

import { MissedConfirmModal } from '../ConfirmModal/MissedConfirmModal';
import { CheckedInConfirmModal } from '../ConfirmModal/CheckedInConfirmModal';

import styles from './queueCard.module.scss';

interface Props {
  appointment: DashboardAppointment;
  bgColor?: string;
  declineColor?: string;
  acceptColor?: {
    text: string;
    bg: string;
  };
  pathToRevalidate: string;
  cssClass?: string;
  displayOn?: 'dashboard' | 'list';
}

export function QueueCard({
  bgColor = '#4B9443',
  declineColor = '#ffffff',
  acceptColor = { text: '#4B9443', bg: '#ffffff' },
  cssClass,
  appointment,
  pathToRevalidate,
  displayOn = 'dashboard',
}: Props) {
  const [openModal, setOpenModal] = useState<'missed' | 'checked-id' | null>(
    null,
  );

  const handleUpdateAppointment = async (body: Partial<Appointment>) => {
    const { data } = await updateAppointment(
      body,
      appointment.id,
      pathToRevalidate,
    );
    if (data) {
      setOpenModal(null);
      toast.success('Appointment was updated successfully');
    }
  };

  return (
    <Box
      className={`${styles.container} ${cssClass}`}
      sx={{ backgroundColor: bgColor }}
    >
      {openModal === 'missed' && (
        <MissedConfirmModal
          customerName={appointment.customer?.fName || 'N/A'}
          open={true}
          handleClose={() => setOpenModal(null)}
          handleConfirmSubmit={async () => {
            await handleUpdateAppointment({
              status: AppointmentStatusEnum.missed,
            });
          }}
        />
      )}
      {openModal === 'checked-id' && (
        <CheckedInConfirmModal
          customerName={appointment.customer?.fName || 'N/A'}
          open={true}
          handleClose={() => setOpenModal(null)}
          handleConfirmSubmit={async () => {
            await handleUpdateAppointment({
              status: AppointmentStatusEnum.checkedIn,
            });
            setOpenModal(null);
          }}
        />
      )}

      <Box className={styles.header}>
        <Box className={styles.info}>
          <Typography className={styles.customerName}>
            {appointment.customer?.fName || 'N/A'}
          </Typography>
          <Typography className={styles.customerPhone}>
            {appointment.customer.phone || 'N/A'}
          </Typography>
        </Box>

        <Box className={styles.info}>
          <Box className={styles.icon}>
            <WaitTimeIcon />
          </Box>
          <Typography className={styles.time}>
            {appointment.waitTimeInMinutes} min Left
          </Typography>
        </Box>
      </Box>
      <Box className={styles.services}>
        {displayOn === 'dashboard' ? (
          <>
            <Typography>Services Requested:</Typography>
            <Typography>{appointment.services?.join(' + ')}</Typography>
          </>
        ) : (
          <>
            <Typography>Queue Position: {appointment.queuePosition}</Typography>
            <Typography>Arrival Time: {appointment.arrivalTime}</Typography>
          </>
        )}
      </Box>
      <CardButtons
        lButton={{
          title: 'Missed',
          color: declineColor,
          props: { onClick: () => setOpenModal('missed') },
        }}
        rButton={{
          bgColor: acceptColor.bg,
          title: 'Check In',
          textColor: acceptColor.text,
          props: { onClick: () => setOpenModal('checked-id') },
        }}
      />
    </Box>
  );
}
