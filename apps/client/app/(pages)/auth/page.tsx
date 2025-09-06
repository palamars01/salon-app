import Link from 'next/link';

import { APP_ROUTES } from '@lib/types/types';

import { Box, Typography } from '@mui/material';

import { ApiRoutes } from '@repo/shared/enums';

import { ActionButton } from './components/ActionButton';
import { GoogleIcon } from '@components/Icons/GoogleIcon';
import { AccountIcon } from '@components/Icons/AccountIcon';
import { config } from '@/config/config';

import styles from './page.module.scss';

export default function Auth() {
  return (
    <Box className={styles.container}>
      <Box className={styles.titleWrapper}>
        <Typography className={styles.title}>Feel Beautiful, Be</Typography>
        <Typography className={styles.title}>Confident Unleashes</Typography>
        <Typography className={styles.title}>Your Inner Glow</Typography>
      </Box>

      <Box className={styles.actionsWrapper}>
        <ActionButton
          buttonProps={{
            variant: 'outlined',
            component: Link,
            href: config.BACKEND_URL + ApiRoutes.auth.google.route,
          }}
        >
          <GoogleIcon />
          <Typography className={styles.button!}>
            Continue with Google
          </Typography>
        </ActionButton>
        <ActionButton
          buttonProps={{
            variant: 'contained',
            component: Link,
            href: APP_ROUTES.AUTH.SIGNUP,
          }}
        >
          <AccountIcon />
          <Typography className={styles.accountButton!}>
            Use phone or email
          </Typography>
        </ActionButton>
      </Box>
      <Box className={styles.termsWrapper}>
        <Typography className={styles.terms}>
          By continuing, you agree to our <Link href="#">Terms of Service</Link>{' '}
          and acknowledge that you have read our{' '}
          <Link href="#">Privacy Policy</Link> to learn how we collect, use and
          share your data.
        </Typography>
      </Box>

      <Box>
        <Typography className={styles.signinLink}>
          Already have an account?{' '}
          <Link href={APP_ROUTES.AUTH.SIGNIN}>Sign in</Link>
        </Typography>
      </Box>
    </Box>
  );
}
