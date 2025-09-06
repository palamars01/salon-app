'use server';

import { Box } from '@mui/material';

import { PublicService } from '@repo/shared/interfaces/salon/service';

import { ServiceCard } from '../ServiceCard/ServiceCard';

import styles from './serviceList.module.scss';

interface Props {
  salonId: string;
  activeServices: PublicService[];
}

export async function ServicesList({ activeServices, salonId }: Props) {
  return (
    <Box className={styles.container}>
      {activeServices.map((service) => (
        <ServiceCard
          key={service.id.toString()}
          service={service}
          salonId={salonId}
        />
      ))}
    </Box>
  );
}
