'use server';
import { Box, Typography } from '@mui/material';

import { ArrowGoBackButton } from '@/components/ArrowGoBackButton/ArrowGoBackButton';

import { HeaderActions } from '../HeaderActions/HeaderActions';

import styles from './pageNav.module.scss';

interface Props {
  title: string;
  nav?: boolean;
  notificationsPath?: string;
  showNotificationsIcon?: boolean;
}

export async function PageNav({
  title,
  nav = true,
  notificationsPath,
  showNotificationsIcon,
}: Props) {
  return (
    <Box className={styles.container}>
      {nav && <ArrowGoBackButton />}
      <Typography className={styles.title}>{title}</Typography>
      <HeaderActions
        notificationsPath={notificationsPath}
        showNotificationsIcon={showNotificationsIcon}
      />
    </Box>
  );
}
