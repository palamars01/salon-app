import { Box, Typography } from '@mui/material';

import { PublicSalon } from '@repo/shared/interfaces/salon';

import { SalonCard } from '@/components/SalonCard/SalonCard';

import styles from './salonList.module.scss';

interface Props {
  salons: PublicSalon[];
}

export function SalonsList({ salons }: Props) {
  if (!salons.length) return null;
  return (
    <Box className={styles.container}>
      <Typography className={styles.title}>Active</Typography>
      <Box className={styles.salons}>
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </Box>
    </Box>
  );
}
