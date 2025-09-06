'use client';

import { FormEvent, JSX, useState } from 'react';

import { toast } from 'react-toastify';

import { redirect } from 'next/navigation';

import { BaseSelectInput } from '@components/BaseSelectInput/BaseSelectInput';
import { SubmitButton } from '@components/SubmitButton/SubmitButton';

import { Box } from '@mui/material';

import { signup } from '@/lib/actions/auth';
import { APP_ROUTES } from '@/lib/types/types';

import { PasswordInput } from '../PasswordInput/PasswordInput';

import styles from './signupForm.module.scss';

interface Props {
  SignupProvider: JSX.Element;
}

export function SignupForm({ SignupProvider }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { data, errors } = await signup(formData);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.user?.id) {
      toast.success('Signed up successfully');
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
      {SignupProvider}

      {/* Password */}
      <PasswordInput
        label="Password"
        showPassword={showPassword}
        handleShowPassword={handleShowPassword}
      />

      {/* Confirm Password */}
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm password"
        showPassword={showConfirmPassword}
        handleShowPassword={handleShowConfirmPassword}
      />

      {/* User Type */}
      <BaseSelectInput label="User Type" />

      {/* Submit button */}
      <SubmitButton
        title="Create Account"
        cssClassName={styles.buttonWrapper}
      />
    </Box>
  );
}
