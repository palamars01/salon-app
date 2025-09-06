'use client';

import { FormEvent, useState } from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';

import { SubmitButton } from '@/components/SubmitButton/SubmitButton';
import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';

import { updateUser } from '@/lib/actions/user';
import { APP_ROUTES } from '@/lib/types/types';

export function UpdateUserPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (formData.get('password') !== formData.get('confirmPassword')) {
      return toast.error('Passwords must be equal');
    }
    formData.append('tempPassword', '');
    const { data, errors } = await updateUser(formData);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.user.privateWorkerId) {
      toast.success('Password has been updated');
      redirect(APP_ROUTES.SALON.DASHBOARD(data.user.privateWorkerId));
    }
  };
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '24px 16px',
        height: '100%',
      }}
      onSubmit={handleSubmit}
      noValidate
    >
      <Typography
        color="secondary"
        sx={{ fontSize: 20, fontWeight: 700, lineHeight: '40px' }}
      >
        Change temprorary password
      </Typography>
      {/* Password */}
      <PasswordInput
        label="Password"
        name="password"
        showPassword={showPassword}
        handleShowPassword={handleShowPassword}
      />

      {/* Confirm Password */}
      <PasswordInput
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm password"
        showPassword={showConfirmPassword}
        handleShowPassword={handleShowConfirmPassword}
      />
      <SubmitButton
        title="Save"
        wrapperStyles={{ width: '100%', mt: 'auto' }}
      />
    </Box>
  );
}
