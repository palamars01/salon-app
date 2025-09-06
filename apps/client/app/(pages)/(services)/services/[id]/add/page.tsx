'use server';

import { Box } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';

import { ServiceForm } from '@/components/ServiceForm/ServiceForm';

import { checkRolePermission } from '@/lib/utils/utils';
import { RolesEnum } from '@repo/shared/enums';

import styles from './addService.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AddService({ params }: Props) {
  await checkRolePermission([RolesEnum.salon, RolesEnum.privateWorker]);
  const { id } = await params;

  return (
    <Box className={styles.container}>
      <PageNav title="Add Service" nav={true} />
      <ServiceForm salonId={id} />
    </Box>
  );
}
