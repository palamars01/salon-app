'use server';

import { Box } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';

import { ServiceForm } from '@/components/ServiceForm/ServiceForm';
import { RolesEnum } from '@repo/shared/enums';

import { getServiceById } from '@/lib/actions/services';
import { checkRolePermission } from '@/lib/utils/utils';

import styles from './edit-service.module.scss';
import { APP_ROUTES } from '@/lib/types/types';

interface Props {
  params: Promise<{ id: string; serviceId: string }>;
}

export default async function EditSalonService({ params }: Props) {
  await checkRolePermission([RolesEnum.salon, RolesEnum.privateWorker]);
  const { id, serviceId } = await params;

  const { data } = await getServiceById(id, serviceId);

  return (
    <Box className={styles.container}>
      <PageNav
        title="Edit Service"
        nav={true}
        notificationsPath={APP_ROUTES.SALON.NOTIFICATIONS.LIST(id)}
      />
      {data.service && <ServiceForm salonId={id} service={data.service} />}
    </Box>
  );
}
