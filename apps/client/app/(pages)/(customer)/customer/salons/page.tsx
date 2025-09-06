import { Box } from '@mui/material';

import { RolesEnum } from '@repo/shared/enums';

import { checkRolePermission } from '@/lib/utils/utils';

import { PageNav } from '@/components/PageNav/PageNav';
import { SalonsList } from '../components/SalonsList/SalonsList';

import styles from './salons.module.scss';
import { getSalonsForCustomer } from '@/lib/actions/salon';
import UpdateCookies from '@/components/UpdateCookies/UpdateCookies';

export default async function Salons() {
  const { fName, phone } = await checkRolePermission([RolesEnum.customer]);

  const { data } = await getSalonsForCustomer();

  return (
    <Box>
      {data.jwtTokens && <UpdateCookies jwtTokens={data.jwtTokens} />}
      <PageNav title="Browse Salons" />
      <Box className={styles.container}>
        <SalonsList userData={{ fName, phone }} salonList={data.salons} />
      </Box>
    </Box>
  );
}
