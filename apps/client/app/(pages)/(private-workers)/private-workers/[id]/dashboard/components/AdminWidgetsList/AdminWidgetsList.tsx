import { Box, IconButton } from '@mui/material';

import { CustomerIcon } from '@/components/Icons/CustomerIcon';
import { GrowArrow } from '@/components/Icons/GrowArrow';
import { QueueIcon } from '@/components/Icons/QueueIcon';

import { Widget } from '@/components/Widget/Widget';

import styles from './adminWidgetList.module.scss';
import { SalonIcon } from '@/components/Icons/SalonIcon';
import { PublicSalon } from '@repo/shared/interfaces/salon';
import { EditIcon } from '@/components/Icons/EditIcon';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/types/types';

interface Props {
  widgetsData: {
    customersWaiting: number;
    totalCustomers: number;
  };
  salon: PublicSalon;
}

export function AdminWidgetsList({ widgetsData, salon }: Props) {
  return (
    <Box className={styles.widgets}>
      <Widget
        title="Total Customers"
        icon={<CustomerIcon />}
        content={widgetsData.totalCustomers}
        contentIcon={<GrowArrow />}
      />
      <Widget
        title="Active Services"
        id="servicesCount"
        icon={<SalonIcon />}
        content={salon?.services?.length || 0}
        buttomIcon={
          <IconButton
            LinkComponent={Link}
            href={APP_ROUTES.SERVICES.MAIN(salon.id)}
            id="add-service"
          >
            <EditIcon />
          </IconButton>
        }
      />

      <Widget
        title="Customers in Queue"
        icon={<QueueIcon />}
        content={widgetsData.customersWaiting}
      />
    </Box>
  );
}
