'use client';

import { FormEvent, JSX, useState } from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';

import { Box } from '@mui/material';

import { SubmitButton } from '@components/SubmitButton/SubmitButton';

import { signin } from '@/lib/actions/auth';
import { APP_ROUTES } from '@lib/types/types';

import { PasswordInput } from '../PasswordInput/PasswordInput';

import styles from './signinForm.module.scss';

interface Props {
  SigninProvider: JSX.Element;
}

export function SigninForm({ SigninProvider }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { data, errors } = await signin(formData);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.user?.id) {
      toast.success('Signed in successfully');
      redirect(APP_ROUTES.ROUTER);
    }
  };
  return (
    <Box
      component="form"
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Email or phone input */}
      {SigninProvider}

      {/* Password */}
      <PasswordInput
        label="Password"
        showPassword={showPassword}
        handleShowPassword={handleShowPassword}
      />

      {/* Submit button */}
      <SubmitButton title="Sign in" cssClassName={styles.buttonWrapper} />
    </Box>
  );
}
