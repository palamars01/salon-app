import { Box, Grid2, Typography } from '@mui/material';

import { AuthTabs, PhoneInput, SignupForm, EmailInput } from '@components/Auth';

import styles from './signup.module.scss';

export default async function Signup() {
  return (
    <Grid2 container className={`${styles.container} .open`}>
      <Box className={styles['title-wrapper']}>
        <Typography className={styles.title}>Sign up</Typography>
      </Box>
      <AuthTabs
        PhoneTab={<SignupForm SignupProvider={<PhoneInput />} />}
        EmailTab={<SignupForm SignupProvider={<EmailInput />} />}
      />
    </Grid2>
  );
}
