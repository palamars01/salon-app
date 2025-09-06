import Link from 'next/link';
import { Box } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';
import { MainButton } from '@/components/Button/Button';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';
import { WorkersList } from './components/WorkersList/WorkersList';

import { RolesEnum } from '@repo/shared/enums';

import { getPrivateWorkers } from '@/lib/actions/privateWorkers';
import { APP_ROUTES } from '@/lib/types/types';
import { checkRolePermission } from '@/lib/utils/utils';

import styles from './privateworkers.module.scss';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrivateWorkersManagement({ params }: Props) {
  await checkRolePermission([RolesEnum.salon]);
  const { id } = await params;
  const { data } = await getPrivateWorkers(id);

  return (
    <Box className={styles.container}>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}

      <PageNav
        title="Personal Stylists Management"
        nav={true}
        showNotificationsIcon={false}
      />
      <Box className={styles.wrapper}>
        {data?.id && <WorkersList {...data} />}

        <Box className={styles.actionsWrapper}>
          <MainButton
            title="+ Add New Personal Stylist"
            buttonProps={{
              variant: 'outlined',
              sx: { textTransform: 'none' },
              component: Link,
              href: APP_ROUTES.PRIVATE_WORKERS.ADD(id),
            }}
          />
          <MainButton
            title="Go to Dashboard"
            buttonProps={{
              component: Link,
              href: APP_ROUTES.SALON.DASHBOARD(id),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
