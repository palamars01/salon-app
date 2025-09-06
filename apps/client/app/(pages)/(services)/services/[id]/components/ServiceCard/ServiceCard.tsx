import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { PublicService } from '@repo/shared/interfaces/salon/service';

import { APP_ROUTES } from '@/lib/types/types';
import { CardButtons } from '@/components/CardButtons/CardButtons';
import { WaitTimeIcon } from '@/components/Icons/WaitTimeIcon';

import styles from './serviceCard.module.scss';

interface Props {
  service: PublicService;
  salonId: string;
}

export function ServiceCard({ service, salonId }: Props) {
  return (
    <Box className={styles.container}>
      <Box className={styles.row}>
        <Box className={`${styles.column} ${styles.columnLeft}`}>
          <Typography className={styles.name}>{service.name}</Typography>
          <Typography className={styles.price}>
            Price: ${service.price}
          </Typography>
        </Box>
        <Box className={styles.column}>
          <Box className={styles.icon}>
            <WaitTimeIcon />
          </Box>
          <Typography className={styles.duration}>
            {service.estimatedDuration} mins
          </Typography>
        </Box>
      </Box>
      <Box className={`${styles.row} ${styles.availability}`}>
        <Typography>Availability</Typography>
        <Typography>{service.availability.join('-')}</Typography>
      </Box>
      <Box>
        <CardButtons
          lButton={{
            title: 'Delete',
            color: '#325928',
            props: {
              component: Link,
              href: APP_ROUTES.SERVICES.DELETE(
                salonId,
                `${service.id.toString()}_${service.name}`,
              ),
            },
          }}
          rButton={{
            title: 'Edit',
            bgColor: '#325928',
            textColor: '#ffffff',
            props: {
              component: Link,
              href: APP_ROUTES.SERVICES.EDIT(salonId, service.id.toString()),
            },
          }}
        />
      </Box>
    </Box>
  );
}
