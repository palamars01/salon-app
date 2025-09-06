'use server';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';
import { MainButton } from '@/components/Button/Button';

import { APP_ROUTES } from '@/lib/types/types';

import styles from './selectServiceModel.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SelectServiceModel({ params }: Props) {
  const { id } = await params;
  return (
    <Box>
      <PageNav title="Service Management Model" nav={false} />
      <Box className={styles.container}>
        <Box className={styles.wrapper}>
          <Typography>You can manage salon services by yourself</Typography>
          <MainButton
            title="Add Service"
            buttonProps={{
              component: Link,
              href: APP_ROUTES.SERVICES.ADD(id),
            }}
          />
        </Box>
        <Box className={styles.wrapper}>
          <Typography>
            You can add each individual personal stylist and they will be able
            to manage their services by themselves
          </Typography>
          <MainButton
            title="Add Personal Stylist"
            buttonProps={{
              component: Link,
              href: APP_ROUTES.PRIVATE_WORKERS.ADD(id),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
