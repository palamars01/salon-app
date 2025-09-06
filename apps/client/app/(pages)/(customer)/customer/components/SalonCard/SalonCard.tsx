import { Box, Typography } from '@mui/material';

import { CustomerDashboardSalon } from '@repo/shared/interfaces/salon';

import { WaitTimeIcon } from '@/components/Icons/WaitTimeIcon';
import { MainButton } from '@/components/Button/Button';

import styles from './salonCard.module.scss';

interface Props {
  salon: CustomerDashboardSalon;
  selectSalon: any;
}

export function SalonCard({ salon, selectSalon }: Props) {
  const { name, city, address, services, privateWorkerName } = salon;

  const servicesList = services.map((s) => s.name).join(', ');
  return (
    <Box component="li" className={styles.container}>
      {privateWorkerName && (
        <Typography className={styles.privateWorker}>
          Personal stylist: {privateWorkerName}
        </Typography>
      )}
      <Box className={styles.header}>
        <Typography className={styles.name}>{name}</Typography>
        <Typography className={styles.location}>
          Location: {city}, {address}
        </Typography>
      </Box>
      <Box className={styles.services}>
        <Typography>Services Offered: {servicesList}</Typography>
      </Box>
      <Box className={styles.waitTime}>
        <Typography>
          Estimated wait time:{' '}
          {salon.freeSeatsAvailable
            ? 'Free seats available!'
            : `${salon.waitTimeInMinutes} mins`}{' '}
        </Typography>
        <WaitTimeIcon />
      </Box>
      <Box className={styles.actions}>
        <MainButton title="Join Queue" buttonProps={{ onClick: selectSalon }} />
      </Box>
    </Box>
  );
}
