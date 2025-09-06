import Link from 'next/link';
import { Box, Modal, Typography } from '@mui/material';

import { CardButtons } from '@/components/CardButtons/CardButtons';
import { APP_ROUTES } from '@/lib/types/types';
import { CreateAppointmentResponse } from '@repo/shared/interfaces/appointment';

import styles from './appointmentSuccess.module.scss';

interface Props {
  appointmentSuccess: CreateAppointmentResponse | null;
  handleClose: () => void;
}

export function AppointmentSuccess({ handleClose, appointmentSuccess }: Props) {
  return (
    <Modal
      open={!!appointmentSuccess}
      onClose={handleClose}
      className={styles.modal}
    >
      <Box className={styles.container}>
        <Typography className={styles.title}>
          You’ve Successfully Joined the Queue!
        </Typography>
        <Box className={styles.queue}>
          <Typography className={styles.title}>
            You are currently in position
          </Typography>
          <Typography className={styles.queuePosition}>
            {appointmentSuccess?.queuePosition}
          </Typography>
        </Box>
        <Box className={styles.queueTime}>
          <Typography>
            You joined the queue at <span>{appointmentSuccess?.joinTime}</span>
          </Typography>
          <Typography>
            Please arrive by <span>{appointmentSuccess?.arrivalTime}</span>
          </Typography>
        </Box>
        <Box className={styles.description}>
          <Typography>
            We’ll notify you when it’s almost your turn. You can also track your
            progress in real-time on the Queue Status screen.
          </Typography>
          <Typography>
            Feel free to leave the queue at any time if your plans change.
          </Typography>
        </Box>
        <CardButtons
          lButton={{
            title: 'Home',
            props: {
              component: Link,
              href: APP_ROUTES.CUSTOMER.DASHBOARD,
            },
          }}
          rButton={{
            title: 'Status',
            props: {
              component: Link,
              href: APP_ROUTES.APPOINTMENTS.STATUS(appointmentSuccess!.id),
            },
          }}
        />
      </Box>
    </Modal>
  );
}
