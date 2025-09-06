import { ChangeEvent } from 'react';

import { Box, Checkbox, Typography } from '@mui/material';

import styles from './customerWaitingCard.module.scss';

interface Props {
  appointmentId: string;
  customer: {
    fName: string;
    phone: string;
    id: string;
  };
  i: number;
  handleSelectCheckIn: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CutomerWaitingCard({
  appointmentId,
  customer,
  i,
  handleSelectCheckIn,
}: Props) {
  return (
    <Box className={styles.container}>
      <Box className={styles.wrapper}>
        <Typography>{i}.</Typography>
        <Box className={styles.customer}>
          <Typography className={styles.name}>{customer.fName}</Typography>
          <Typography className={styles.phone}>{customer.phone}</Typography>
        </Box>
      </Box>
      <Box className={styles.checkbox}>
        <Checkbox
          id={appointmentId}
          color="primary"
          onChange={handleSelectCheckIn}
        />
      </Box>
    </Box>
  );
}
