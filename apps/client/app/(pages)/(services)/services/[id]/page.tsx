'use server';

import Link from 'next/link';
import { Box } from '@mui/material';

import { APP_ROUTES } from '@/lib/types/types';
import { getServices } from '@/lib/actions/services';
import { checkRolePermission } from '@/lib/utils/utils';

import { PageNav } from '@/components/PageNav/PageNav';
import { RolesEnum } from '@repo/shared/enums';

import { MainButton } from '@/components/Button/Button';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

import { ServicesList } from './components/ServicesList/ServicesList';

import styles from './service-management.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ServicesManagement({ params }: Props) {
  const userData = await checkRolePermission([
    RolesEnum.salon,
    RolesEnum.privateWorker,
  ]);
  const { id } = await params;

  const { data } = await getServices(id);

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}
      <PageNav
        title="Service Management"
        nav={true}
        notificationsPath={APP_ROUTES.SALON.NOTIFICATIONS.LIST(id)}
      />
      <Box className={styles.wrapper}>
        {!!data.services.length && (
          <ServicesList activeServices={data.services} salonId={id} />
        )}

        <Box className={styles.actionsWrapper}>
          <MainButton
            title="+ Add New Service"
            buttonProps={{
              variant: 'outlined',
              sx: { textTransform: 'none' },
              component: Link,
              href: APP_ROUTES.SERVICES.ADD(id),
            }}
          />
          <MainButton
            title="Go to Dashboard"
            buttonProps={{
              component: 'a',
              href:
                userData.role === RolesEnum.salon
                  ? APP_ROUTES.SALON.DASHBOARD(id)
                  : APP_ROUTES.PRIVATE_WORKERS.DASHBOARD(
                      userData.privateWorkerId!,
                    ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
