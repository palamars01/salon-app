import { Box } from '@mui/material';

import { PrivateWorker } from '@repo/shared/interfaces/salon/privateWorker';

import { WorkerCard } from '../WorkerCard/WorkerCard';

import styles from './workersList.module.scss';

interface Props {
  privateWorkers: PrivateWorker[];
  id: string;
}

export function WorkersList({ privateWorkers, id }: Props) {
  return (
    <Box className={styles.container}>
      {privateWorkers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} salonId={id} />
      ))}
    </Box>
  );
}
