import { Box, Grid2, Typography } from '@mui/material';

import { AuthTabs, PhoneInput, EmailInput, SigninForm } from '@components/Auth';

import styles from './signin.module.scss';

export default function Signin() {
  return (
    <Grid2 container className={`${styles.container} .open`}>
      <Box className={styles['title-wrapper']}>
        <Typography className={styles.title}>Sign in</Typography>
      </Box>
      <AuthTabs
        PhoneTab={<SigninForm SigninProvider={<PhoneInput />} />}
        EmailTab={<SigninForm SigninProvider={<EmailInput />} />}
      />
    </Grid2>
  );
}
