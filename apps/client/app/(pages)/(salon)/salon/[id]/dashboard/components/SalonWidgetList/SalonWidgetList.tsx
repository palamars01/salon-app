import Link from 'next/link';

import { Box, IconButton } from '@mui/material';

import { PublicSalon } from '@repo/shared/interfaces/salon';
import { AppointmentStatusEnum } from '@repo/shared/enums';

import { APP_ROUTES } from '@/lib/types/types';

import { Widget } from '@/components/Widget/Widget';

import { SalonIcon } from '@/components/Icons/SalonIcon';
import { EditIcon } from '@/components/Icons/EditIcon';
import { CustomerIcon } from '@/components/Icons/CustomerIcon';
import { GrowArrow } from '@/components/Icons/GrowArrow';
import { WaitTimeIcon } from '@/components/Icons/WaitTimeIcon';

import styles from './salonWidgetList.module.scss';

interface Props {
  salon: PublicSalon;
}

export function WidgetList({ salon }: Props) {
  return (
    <Box className={styles.widgets}>
      <Box className={styles.wrapper}>
        <Widget
          title="Active Services"
          icon={<SalonIcon color="#ffffff" />}
          content={salon?.services?.length || 0}
          id="servicesCount"
          buttomIcon={
            <IconButton
              LinkComponent={Link}
              href={APP_ROUTES.SERVICES.MAIN(salon.id)}
            >
              <EditIcon />
            </IconButton>
          }
        />
        <Widget
          title="Personal stylists"
          icon={<SalonIcon color="#ffffff" />}
          content={salon?.privateWorkers?.length || 0}
          buttomIcon={
            <IconButton
              LinkComponent={Link}
              href={APP_ROUTES.PRIVATE_WORKERS.MAIN(salon.id)}
            >
              <EditIcon />
            </IconButton>
          }
        />

        <Box className={styles.waitingWidget}>
          <Widget
            title="Customers Waiting"
            icon={<CustomerIcon />}
            content={
              salon.appointments?.filter(
                (a) => a.status === AppointmentStatusEnum.approved,
              ).length || 0
            }
            contentIcon={<GrowArrow />}
          />
        </Box>
        <Widget
          title="Avg Wait Time"
          icon={<WaitTimeIcon />}
          content="20"
          contentIcon="min"
        />
      </Box>
    </Box>
  );
}
