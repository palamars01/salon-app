import { Box } from '@mui/material';

import { CustomerIcon } from '@/components/Icons/CustomerIcon';
import { GrowArrow } from '@/components/Icons/GrowArrow';
import { WaitTimeIcon } from '@/components/Icons/WaitTimeIcon';
import { SalonIcon } from '@/components/Icons/SalonIcon';
import { QueueIcon } from '@/components/Icons/QueueIcon';

import { Widget } from '@/components/Widget/Widget';

import styles from './adminWidgetList.module.scss';

interface Props {
  widgetsData: {
    totalSalons: number;
    activeQueues: number;
    totalCustomers: number;
  };
}

export function AdminWidgetsList({ widgetsData }: Props) {
  return (
    <Box className={styles.widgets}>
      <Widget
        title="Total Customers"
        icon={<CustomerIcon />}
        content={widgetsData.totalCustomers}
        contentIcon={<GrowArrow />}
      />
      <Widget
        title="Avg Wait Time"
        icon={<WaitTimeIcon />}
        content="20"
        contentIcon="min"
      />
      <Widget
        title="Total Salons"
        icon={<SalonIcon />}
        content={widgetsData?.totalSalons || 0}
        contentIcon={<GrowArrow />}
      />
      <Widget
        title="Active Queues"
        icon={<QueueIcon />}
        content={widgetsData.activeQueues}
      />
    </Box>
  );
}
