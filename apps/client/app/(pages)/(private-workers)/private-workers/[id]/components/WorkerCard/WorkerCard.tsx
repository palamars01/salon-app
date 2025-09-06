import { PrivateWorker } from '@repo/shared/interfaces/salon/privateWorker';
import { Box, Typography } from '@mui/material';

import { Actions } from './Actions';

import styles from './workerCard.module.scss';

interface Props {
  worker: PrivateWorker;
  salonId: string;
}
export function WorkerCard({ worker, salonId }: Props) {
  return (
    <Box className={styles.container}>
      <Box>
        <Typography>Name: {worker.user.fName}</Typography>
        <Typography>Services: {worker.services?.length}</Typography>
      </Box>
      <Actions
        salonId={salonId}
        privateWorkerId={worker.id}
        cssClass={styles.button!}
      />
    </Box>
  );
}
