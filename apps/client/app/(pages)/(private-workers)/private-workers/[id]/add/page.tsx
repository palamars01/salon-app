import { Box } from '@mui/material';
import { PageNav } from '@/components/PageNav/PageNav';

import { checkRolePermission } from '@/lib/utils/utils';
import { RolesEnum } from '@repo/shared/enums';

import { AddPrivateWorkerForm } from '../components/AddPrivateWorkerForm/AddPrivateWorkerForm';

import styles from './addPrivateWorker.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AddSPrivateWorker({ params }: Props) {
  await checkRolePermission([RolesEnum.salon]);
  const { id } = await params;

  return (
    <Box className={styles.container}>
      <PageNav
        title="Add Personal Stylist"
        nav={true}
        showNotificationsIcon={false}
      />
      <AddPrivateWorkerForm salonId={id} />
    </Box>
  );
}
