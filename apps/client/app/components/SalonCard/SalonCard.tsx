import Link from 'next/link';
import { Box } from '@mui/material';

import { PublicSalon } from '@repo/shared/interfaces/salon';

import { SalonIcon } from '@/components/Icons/SalonIcon';
import { APP_ROUTES } from '@/lib/types/types';

import styles from './salonCard.module.scss';

interface Props {
  salon: PublicSalon;
}

export function SalonCard({ salon }: Props) {
  return (
    <Box
      component={Link}
      href={APP_ROUTES.SALON.DASHBOARD(salon.id)}
      className={styles.container}
    >
      <Box className={styles.icon}>
        <SalonIcon />
      </Box>
      <Box className={styles.address}>
        {salon.city},{salon.address}
      </Box>
    </Box>
  );
}
